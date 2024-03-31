/* eslint-disable prettier/prettier */

import { Lobby } from '../lobby/lobby';
import { AuthenticatedSocket } from '../types';
import { ServerPayloads } from '../utils/ServerPayloads';
import { ServerEvents } from '../utils/ServerEvents';
import {
  generateFromCharacteristics,
  getRandomIndex,
  countOccurrences,
  getKeysWithHighestValue,
} from 'helpers';

export class Instance {
  public hasStarted: boolean = false;
  public hasFinished: boolean = false;
  public isSuspended: boolean = false;
  public players: any = [];
  public characteristics: any = {};
  public conditions: any = {};
  public currentStage: number;
  public stages: any[];
  public startPlayerId: string;
  public revealPlayerId: string;
  public voteKickList: any = [];

  private charsRevealedCount: number = 0;
  private readonly charOpenLimit: number = 2; // per 1 player on every stage

  constructor(private readonly lobby: Lobby) {}

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
    const stages: { title: string; isActive: boolean; index: number }[] = [];
    for (let i = 1; i <= Math.floor(this.lobby.clients.size / 2); i++) {
      stages.push(
        { title: 'Open', isActive: true, index: stages.length + 1 },
        { title: 'Kick', isActive: false, index: stages.length + 2 },
      );
    }
    this.stages = stages;

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
    // kicked player can not reveal characteristics
    const isKicked = this.players.find(player => player.userId === userId).isKicked === true;
    if (isKicked) {
      return;
    }
    // open chars only on reveal stages
    if (this.currentStage % 2 === 0) {
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
      const chooseNextToReveal = (revealPlayerId, attempt = 0) => {
        const totalPlayers = this.players.length;
        if (attempt >= totalPlayers) return null; // Base case to prevent infinite recursion

        const currentIndex = this.players.findIndex(p => p.userId === revealPlayerId);
        const nextIndex = (currentIndex + 1) % totalPlayers; // When reaching the end of the player list, the search wraps around to the beginning 
        const revealPlayer = this.players[nextIndex];

        if (revealPlayer.isKicked) {
          // If the next player is kicked, recursively search for the next
          return chooseNextToReveal(revealPlayer.userId, attempt + 1);
        }
        return revealPlayer.userId;
      };

      this.revealPlayerId = chooseNextToReveal(this.revealPlayerId);
    }

    // transit to the next stage
    const allRevealsOnCurrentStage =
      this.charsRevealedCount >= this.currentStage * this.charOpenLimit * (this.players.filter(_ => _.isKicked !== true).length);

    if (allRevealsOnCurrentStage) {
      this.transitNextStage()
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
    const { userId, contestantId } = data;

    // kicked player can not vote
    const isKicked = this.players.find(player => player.userId === userId).isKicked === true;
    if (isKicked) {
      return;
    }

    // vote only on kick stages
    if (this.currentStage % 2 === 1) {
      return;
    }

    // do not allow to vote several times
    if (this.voteKickList.find(_ => _.userId === userId)) {
      return;
    }

    this.voteKickList = [...this.voteKickList, { userId, contestantId }]

    // calc votes and kick player
    if (this.voteKickList.length >= this.players.filter(_ => _.isKicked !== true).length) {
      const contestantIds = this.voteKickList.map((_: { contestantId: any; }) => _.contestantId);
      const occurrences = countOccurrences(contestantIds);
      const keysWithHighestValue = getKeysWithHighestValue(occurrences);

      let kickedPlayer: any;
      if (keysWithHighestValue.length > 1) {
        const randomIndex = getRandomIndex(keysWithHighestValue.length);
        const userIdToKick = keysWithHighestValue[randomIndex];
        this.players.find(player => player.userId === userIdToKick).isKicked = true;
        kickedPlayer = this.players.find(player => player.userId === userIdToKick)
      } else {
        this.players.find(player => player.userId === keysWithHighestValue[0]).isKicked = true;
        kickedPlayer = this.players.find(player => player.userId === keysWithHighestValue[0])
      }
      this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
        ServerEvents.GameMessage,
        {
          color: 'blue',
          message: `${kickedPlayer.displayName} is kicked!`,
        },
      );

      this.voteKickList = []; // clear the list after kick

      // game over (kicked the half)
      if (Math.floor(this.players.length / 2) === this.players.filter(_ => _.isKicked).length) {
        this.triggerFinish();
        this.lobby.dispatchLobbyState();
        return;
      }

      this.transitNextStage();
      this.lobby.dispatchLobbyState();
      return;
    }

    const user = this.players.find(player => player.userId === userId);

    this.lobby.dispatchLobbyState();
    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        color: 'blue',
        message: `${user.displayName} is voted!`,
      },
    );
  }

  public sendChatMessage(data: any, client: AuthenticatedSocket): void {
    this.lobby.dispatchToLobby(ServerEvents.ChatMessage, data);
  }

  private transitNextStage(): void {
    this.currentStage = this.currentStage + 1;

    // deactivate stages
    for (let i = 0; i < this.stages.length; i++) {
      if (this.stages[i].isActive) {
        this.stages[i].isActive = false;
      }
    }

    // set active current stage
    const index = this.stages.findIndex((s) => s.index === this.currentStage);
    if (index !== -1) {
      this.stages[index].isActive = true;
    }
  }
}
