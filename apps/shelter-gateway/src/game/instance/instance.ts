import { Socket } from 'socket.io';
import { Lobby } from '../lobby/lobby';
import { CardState } from './cardState';
import { ServerException } from '../server.exception';
import { AuthenticatedSocket } from '../types';

import { Cards } from '../utils/Cards';
import { SocketExceptions } from '../utils/SocketExceptions';
import { ServerPayloads } from '../utils/ServerPayloads';
import { ServerEvents } from '../utils/ServerEvents';
import { generateCharList } from 'helpers';

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

  constructor(private readonly lobby: Lobby) {
    this.initializeCards();
  }

  public triggerStart(): void {
    if (this.hasStarted) {
      return;
    }

    this.hasStarted = true;
    this.lobby.instance.players.map((player) => {
      const newChars = generateCharList();
      this.characteristics[player.userId] = newChars;
    });

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

    // update in lobbies
    const uCharList = this.characteristics[userId];
    uCharList.find(
      (curChar: { type: any }) => curChar.type === char.type,
    ).isRevealed = true;
    this.characteristics[userId] = uCharList;

    this.lobby.dispatchLobbyState();
    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        color: 'blue',
        message: 'Characteristic is opened!',
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
