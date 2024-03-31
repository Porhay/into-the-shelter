/* eslint-disable prettier/prettier */

import { Socket } from 'socket.io';
import { Lobby } from '../lobby/lobby';
import { CardState } from './cardState';
import { ServerException } from '../server.exception';
import { AuthenticatedSocket } from '../types';

import { Cards } from '../utils/Cards';
import { SocketExceptions } from '../utils/SocketExceptions';
import { ServerPayloads } from '../utils/ServerPayloads';
import { ServerEvents } from '../utils/ServerEvents';
import { generateFromCharacteristics, getRandomIndex } from 'helpers';

export class Instance {
  public hasStarted: boolean = false;
  public hasFinished: boolean = false;
  public isSuspended: boolean = false;
  public currentRound: number = 1;
  public cards: CardState[] = [];
  public scores: Record<Socket['id'], number> = {};
  public delayBetweenRounds: number = 2;
  private cardsRevealedForCurrentRound: Record<number, Socket['id']> = {};
  public players: any = [];
  public characteristics: any = {};
  public conditions: any = {};
  public currentStage: number;
  public stages: any[];
  public startPlayerId: string;
  public revealPlayerId: string;

  private charsRevealedCount: number = 0;
  private readonly charOpenLimit: number = 2; // per 1 player on every stage

  constructor(private readonly lobby: Lobby) {
    this.initializeCards();
  }

  public async triggerStart(
    data: { isPrivate: boolean; maxClients: number; organizatorId: string },
    client: AuthenticatedSocket,
  ): Promise<void> {
    if (this.hasStarted) {
      return;
    }

    // update lobby's settings
    this.lobby.isPrivate = data.isPrivate;
    // TODO: this.lobby.maxClients = data.maxClients;
    // TODO: this.lobby.isTimerOn = data.isTimerOn;

    // set random characteristics
    this.hasStarted = true;
    this.players.map((player) => {
      const newChars = generateFromCharacteristics('charList');
      this.characteristics[player.userId] = newChars;
    });
    this.conditions = generateFromCharacteristics('conditions');

    // set current game stage as 1 because game is started
    this.currentStage = 1;

    // generate stages
    // const stages: { title: string; isActive: boolean; index: number }[] = [];
    // for (let i = 1; i <= Math.floor(this.lobby.clients.size / 2); i++) {
    //   stages.push(
    //     { title: 'Open', isActive: false, index: stages.length + 1 },
    //     { title: 'Kick', isActive: false, index: stages.length + 2 },
    //   );
    // }
    // this.stages = stages;

    // const updateStageIsActive = () => {
    //   const stages = this.stages.map((s) => {
    //     s.isActive = s.index === this.currentStage;
    //   });
    //   this.stages = stages;
    // };

    this.stages = [
      { title: 'Open', isActive: this.currentStage === 1 },
      { title: 'Kick', isActive: this.currentStage === 2 },
      { title: 'Open', isActive: this.currentStage === 3 },
      { title: 'Kick', isActive: this.currentStage === 4 },
    ];

    // choose random player to reveal chars
    const startPlayerIndex = getRandomIndex(this.players.length);
    this.startPlayerId = this.players[startPlayerIndex].userId;
    this.revealPlayerId = this.players[startPlayerIndex].userId; // id of player that can reveal it's characteristics

    this.lobby.dispatchLobbyState();
    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        color: 'blue',
        message: 'Game started!',
      },
    );
  }

  public triggerFinish(): void {
    if (this.hasFinished || !this.hasStarted) {
      return;
    }

    this.hasFinished = true;

    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        color: 'blue',
        message: 'Game finished !',
      },
    );
  }

  public revealChar(data: any, client: AuthenticatedSocket): void {
    const { char, userId } = data;
    if (!this.hasStarted) {
      return;
    }

    if (this.revealPlayerId !== userId) {
      return;
    }

    const uCharList = this.characteristics[userId];

    // check if user not reveales more chars then limited
    let uCharsRevealed: number = uCharList.filter(
      (char: { isRevealed: boolean }) => char.isRevealed === true,
    ).length;
    if (uCharsRevealed >= this.currentStage * this.charOpenLimit) {
      return;
    }

    // update user's characteristic
    uCharList.find(
      (curChar: { type: any }) => curChar.type === char.type,
    ).isRevealed = true;
    this.characteristics[userId] = uCharList;
    this.charsRevealedCount = this.charsRevealedCount + 1;
    uCharsRevealed = uCharsRevealed + 1

    /* check if user revealed all possible characteristics and 
      choose next player that can reveal chars */
    if (uCharsRevealed === this.currentStage * this.charOpenLimit) {
      const revealPlayerIndex = this.players.findIndex(
        (p) => p.userId === this.revealPlayerId,
      );
      this.revealPlayerId = this.players[revealPlayerIndex + 1]?.userId || this.players[0].userId;
    }

    // transit to the next stage
    const allRevealsOnCurrentStage = this.charsRevealedCount >=
      this.currentStage * this.charOpenLimit * this.players.length;

    if (this.revealPlayerId === this.startPlayerId && allRevealsOnCurrentStage) {
      // game is overed (all players revealed limit of characteristics)
      if (this.charsRevealedCount >= this.players.length * (this.stages.length / 2) * this.charOpenLimit) {
        this.triggerFinish();
        return;
      }
      this.currentStage = this.currentStage + 1;
      this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
        ServerEvents.GameMessage,
        {
          color: 'blue',
          message: `Stage ${this.currentStage} is started!`,
        },
      );
    }

    this.lobby.dispatchLobbyState();
    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        color: 'blue',
        message: 'Characteristic is opened!',
      },
    );
  }

  public voteKick(data: any, client: AuthenticatedSocket): void {
    const { userId, playerId } = data;

    const user = this.players.find(player => player.userId === userId)

    this.lobby.dispatchLobbyState();
    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        color: 'blue',
        message: `${user.displayName} is voted!`,
      },
    );
  }

  // TODO: used as example, will be removed soon
  public revealCard(cardIndex: number, client: AuthenticatedSocket): void {
    if (this.isSuspended || this.hasFinished || !this.hasStarted) {
      return;
    }

    // Make sure player didn't play two time already for this round
    let cardAlreadyRevealedCount = 0;

    for (const clientId of Object.values(this.cardsRevealedForCurrentRound)) {
      if (clientId === client.id) {
        cardAlreadyRevealedCount++;
      }
    }

    if (cardAlreadyRevealedCount >= 2) {
      return;
    }

    const cardState = this.cards[cardIndex];

    if (!cardState) {
      throw new ServerException(
        SocketExceptions.GameError,
        'Card index invalid',
      );
    }

    // If card is already revealed then stop now, no need to reveal it again
    if (cardState.isRevealed) {
      return;
    }

    cardState.isRevealed = true;
    cardState.ownerId = client.id;

    // this.cardsRevealedForCurrentRound.push(cardIndex);
    this.cardsRevealedForCurrentRound[cardIndex] = cardState.ownerId;

    client.emit<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        color: 'blue',
        message: 'You revealed card',
      },
    );

    // If everyone played (revealed 2 cards) then go to next round
    const everyonePlayed =
      Object.values(this.cardsRevealedForCurrentRound).length ===
      this.lobby.clients.size * 2;

    // If every card have been revealed then go to next round
    let everyCardRevealed = true;

    for (const card of this.cards) {
      if (!card.isRevealed) {
        everyCardRevealed = false;

        break;
      }
    }

    if (everyonePlayed || everyCardRevealed) {
      this.transitionToNextRound();
    }

    this.lobby.dispatchLobbyState();
  }

  public sendChatMessage(data: any, client: AuthenticatedSocket): void {
    this.lobby.dispatchToLobby(ServerEvents.ChatMessage, data);
  }

  public revealCharacteristic(
    charType: number,
    client: AuthenticatedSocket,
  ): void {
    if (this.hasFinished || !this.hasStarted) {
      return;
    }

    client.emit<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        color: 'blue',
        message: `You revealed characteristic: ${charType}`,
      },
    );

    const playerIndex = this.players.findIndex(
      (player) => player.socketId === client.id,
    );
    console.log(this.players[playerIndex]);

    this.lobby.dispatchLobbyState();
  }

  private transitionToNextRound(): void {
    this.isSuspended = true;

    setTimeout(() => {
      this.isSuspended = false;
      this.currentRound += 1;
      this.cardsRevealedForCurrentRound = {};

      // Loop over each card, and see if they have a pair for the same owner,
      // if so then the card is locked and owner gains a point
      const cardsRevealed = new Map<Cards, CardState>();

      for (const cardState of this.cards) {
        if (cardState.isLocked) {
          continue;
        }

        if (!cardState.isRevealed) {
          continue;
        }

        const previousCard = cardsRevealed.get(cardState.card);

        // We have a pair
        if (previousCard && previousCard.ownerId === cardState.ownerId) {
          cardState.isLocked = true;
          previousCard.isLocked = true;

          // Increment player score
          this.scores[cardState.ownerId!] =
            (this.scores[cardState.ownerId!] || 0) + 1;
        }

        cardsRevealed.set(cardState.card, cardState);
      }

      // Loop again to hide cards that aren't locked
      // also check if they're not all locked, would mean game is over
      let everyCardLocked = true;

      for (const cardState of this.cards) {
        if (!cardState.isLocked) {
          cardState.isRevealed = false;
          cardState.ownerId = null;
          everyCardLocked = false;
        }
      }

      if (everyCardLocked) {
        this.triggerFinish();
      }

      this.lobby.dispatchLobbyState();
    }, 1000 * this.delayBetweenRounds);
  }

  // TODO: used as example, will be removed soon
  private initializeCards(): void {
    // Get only values, not identifiers
    const cards = Object.values(Cards).filter((c) =>
      Number.isInteger(c),
    ) as Cards[];

    // Push two time the card into the list, so it makes a pair
    for (const card of cards) {
      const cardState1 = new CardState(card);
      const cardState2 = new CardState(card);

      this.cards.push(cardState1);
      this.cards.push(cardState2);
    }

    // Shuffle array randomly
    this.cards = this.cards.sort((a, b) => 0.5 - Math.random());
  }
}
