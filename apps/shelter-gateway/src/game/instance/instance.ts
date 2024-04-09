/* eslint-disable prettier/prettier */

import {
  generateFromCharacteristics,
  getRandomIndex,
  countOccurrences,
  getKeysWithHighestValue,
  isset
} from 'helpers';
import { Lobby } from '../lobby/lobby';
import { AuthenticatedSocket } from '../types';
import { ServerPayloads } from '../utils/ServerPayloads';
import { ServerEvents } from '../utils/ServerEvents';
import { constants } from '@app/common';


export class Instance {
  public hasStarted: boolean = false;
  public hasFinished: boolean = false;
  public isSuspended: boolean = false;
  public players: any = [];
  public characteristics: any = {};
  public conditions: any = {};
  public specialCards: any = {};
  public currentStage: number;
  public stages: any[];
  public startPlayerId: string;
  public revealPlayerId: string;
  public voteKickList: any = [];
  public kickedPlayers: string[] = [];

  private charsRevealedCount: number = 0;
  private readonly charOpenLimit: number = 2; // per 1 player on every stage

  constructor(
    private readonly lobby: Lobby,
  ) { }

  public async triggerStart(
    data: { isPrivate: boolean; maxClients: number; organizatorId: string },
    client: AuthenticatedSocket,
  ): Promise<void> {
    if (this.hasStarted) {
      return;
    }
    if (this.lobby.clients.size < 2) {
      return this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
        ServerEvents.GameMessage,
        {
          color: 'blue',
          message: 'Find a friend to play :D',
        },
      );
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

      // set special cards for user
      this.specialCards[player.userId] = generateFromCharacteristics('specialCard');
    });

    // set conditions
    this.conditions = generateFromCharacteristics('conditions');

    // set current game stage as 1 because game is started
    this.currentStage = 1;

    // generate stages
    const stages: { title: string; isActive: boolean; index: number }[] = [];
    for (let i = 1; i <= Math.floor(this.lobby.clients.size / 2); i++) {
      stages.push(
        { title: 'Open', isActive: false, index: stages.length + 1 },
        { title: 'Kick', isActive: false, index: stages.length + 2 },
      );
    }
    stages[0].isActive = true // set first stage as active
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

  public async revealChar(data: any, client: AuthenticatedSocket): Promise<void> {
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
    if (this.currentStage % 2 === 0 || !isset(this.currentStage)) {
      return;
    }

    const uCharList = this.characteristics[userId];

    // check if user not reveales more chars then limited
    let uCharsRevealed: number = uCharList.filter(
      (char: { isRevealed: boolean }) => char.isRevealed === true,
    ).length;
    if (uCharsRevealed >= Math.ceil(this.currentStage / 2) * this.charOpenLimit) {
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
    if (uCharsRevealed === Math.ceil(this.currentStage / 2) * this.charOpenLimit) {
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
      this.charsRevealedCount >= this.charOpenLimit * (this.players.filter(_ => _.isKicked !== true).length);

    if (allRevealsOnCurrentStage) {
      this.transitNextStage(data, client)
      this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
        ServerEvents.GameMessage,
        {
          color: 'blue',
          message: `Stage ${this.currentStage} is started!`,
        },
      );
    }

    // create activity log
    await this.lobby.activityLogsService.createActivityLog({
      userId: data.userId,
      lobbyId: client.data.lobby.id,
      action: constants.revealChar,
      payload: data,
    });

    this.lobby.dispatchLobbyState();
    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        color: 'blue',
        message: 'Characteristic is opened!',
      },
    );
  }

  public async voteKick(data: any, client: AuthenticatedSocket): Promise<void> {
    const { userId, contestantId } = data;

    // kicked player can not vote
    const isKicked = this.players.find(player => player.userId === userId).isKicked === true;
    if (isKicked) {
      return;
    }

    // vote only on kick stages
    if (this.currentStage % 2 === 1 || !isset(this.currentStage)) {
      return;
    }

    // do not allow to vote several times
    if (this.voteKickList.find(_ => _.userId === userId)) {
      return;
    }

    this.voteKickList = [...this.voteKickList, { userId, contestantId }]

    // create activity log
    await this.lobby.activityLogsService.createActivityLog({
      userId: data.userId,
      lobbyId: client.data.lobby.id,
      action: constants.voteKick,
      payload: data,
    });

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
        this.kickedPlayers = [...this.kickedPlayers, userIdToKick]
        kickedPlayer = this.players.find(player => player.userId === userIdToKick)
      } else {
        this.players.find(player => player.userId === keysWithHighestValue[0]).isKicked = true;
        this.kickedPlayers = [...this.kickedPlayers, keysWithHighestValue[0]]
        kickedPlayer = this.players.find(player => player.userId === keysWithHighestValue[0])
      }

      // create activity log
      await this.lobby.activityLogsService.createActivityLog({
        userId: data.userId,
        lobbyId: client.data.lobby.id,
        action: constants.playerKicked,
        payload: { userId: kickedPlayer.userId }, // kicked player id
      });

      this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
        ServerEvents.GameMessage,
        {
          color: 'blue',
          message: `${kickedPlayer.displayName} is kicked!`,
        },
      );


      this.charsRevealedCount = 0 // clear round char counter
      this.voteKickList = []; // clear the list after kick

      // game over (kicked the half)
      if (Math.floor(this.players.length / 2) === this.players.filter(_ => _.isKicked).length) {
        this.triggerFinish();
        this.lobby.dispatchLobbyState();
        return;
      }

      this.transitNextStage(data, client);
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

  public async useSpecialCard(data: any, client: AuthenticatedSocket): Promise<void> {
    const { specialCard, userId, contestantId = null } = data;
    if (!this.hasStarted || this.hasFinished) {
      return;
    }
    // kicked player can not use spec card
    const isKicked = this.players.find(player => player.userId === userId).isKicked === true;
    if (isKicked) {
      return;
    }

    // check if card is already used
    const scard = this.specialCards[userId].find(card => card.type === specialCard.type)
    if (scard.isUsed === true) {
      return;
    }

    // apply changes and set as used
    this.applyChanges(specialCard.id, userId, contestantId)
    this.specialCards[userId].find(card => card.type === specialCard.type).isUsed = true;

    // create activity log
    await this.lobby.activityLogsService.createActivityLog({
      userId: data.userId,
      lobbyId: client.data.lobby.id,
      action: constants.useSpecialCard,
      payload: data,
    });

    const user = this.players.find(player => player.userId === userId);
    this.lobby.dispatchLobbyState();
    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        color: 'blue',
        message: `${user.displayName} used special card!`,
      },
    );
  }

  public sendChatMessage(data: any, client: AuthenticatedSocket): void {
    this.lobby.dispatchToLobby(ServerEvents.ChatMessage, data);
  }

  private async transitNextStage(data: any, client: AuthenticatedSocket): Promise<void> {
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

    // create activity log
    await this.lobby.activityLogsService.createActivityLog({
      userId: data.userId,
      lobbyId: client.data.lobby.id,
      action: constants.nextStageStarted,
      payload: {...data, currentStage: this.currentStage}, // only currentStage needed
    });

  }

  /* applies changes on special card use */
  private applyChanges(specialCardId: number, userId: string, contestantId: string | null = null): void {
    const applyChangesForSelf = (charType: string, changeTo: string | null = null) => {
      const uCharList = this.characteristics[userId];
      if (changeTo) {
        uCharList.find((char) => char.type === charType).text = changeTo;
        this.characteristics[userId] = uCharList;
        return;
      }

      const newCharText = generateFromCharacteristics('charList').find((char) => char.type === charType).text;
      uCharList.find((char) => char.type === charType).text = newCharText;
      this.characteristics[userId] = uCharList;
    }

    const applyChangesForAll = (charType: string) => {
      for (const player of this.players) {
        const newCharText = generateFromCharacteristics('charList').find((char) => char.type === charType).text;

        const uCharList = this.characteristics[player.userId];
        uCharList.find((char) => char.type === charType).text = newCharText;
        this.characteristics[player.userId] = uCharList;
      }
    }

    const applyChangesForContestent = (charType: string) => {
      const cCharList = this.characteristics[contestantId];
      const newCharText = generateFromCharacteristics('charList').find((char) => char.type === charType).text;
      cCharList.find((char) => char.type === charType).text = newCharText;
      this.characteristics[contestantId] = cCharList;
    }

    const exchangeWithContestent = (charType: string) => {
      const uCharList = this.characteristics[userId]; // user characteristics list
      const cCharList = this.characteristics[contestantId]; // contestant characteristics list

      const newUCharText = cCharList.find((char) => char.type === charType).text; // text for user
      const newCCharText = uCharList.find((char) => char.type === charType).text; // text for contestant

      uCharList.find((char) => char.type === charType).text = newUCharText; // update user with contestant's text
      cCharList.find((char) => char.type === charType).text = newCCharText; // update contestant with user's text

      // update for both globally
      this.characteristics[userId] = uCharList;
      this.characteristics[contestantId] = cCharList;
    }

    const updateConditions = (type: string) => {
      if (type === 'catastrophe') {
        const newCatastrophe = generateFromCharacteristics('conditions').catastrophe;
        this.conditions.catastrophe = newCatastrophe
      }
    }

    // apply changes accoring to special card id
    switch (specialCardId) {
      case 1: // Замінити собі здоров'я на випадкове
        applyChangesForSelf('health')
        break;
      case 2: // Замінити собі професію на випадкову
        applyChangesForSelf('job')
        break;
      case 3: // Замінити собі рюкзак на випадковий
        applyChangesForSelf('backpack')
        break;
      case 4: // Замінити всім професію на випадкову
        applyChangesForAll('job')
        break;
      case 5: // Замінити всім здоров'я на випадкове
        applyChangesForAll('health')
        break;
      case 6: // Вилікувати собі будь яку хворобу
        applyChangesForSelf('health', 'Абсолютно здоровий')
        break;
      case 7: // Замінити всім фобію на випадкову
        applyChangesForAll('phobia')
        break;
      case 8: // Замінити катастрофу на випадкову
        updateConditions('catastrophe')
        break;
      case 9: // Замінити здоров'я суперника на випадкове
        applyChangesForContestent('health')
        break;
      case 10: // Замінити професію суперника на випадкову
        applyChangesForContestent('job')
        break;
      case 11: // Обмінятися здоров'ям із суперником
        exchangeWithContestent('health')
        break;
      case 12: // Обмінятися професією із суперником
        exchangeWithContestent('job')
        break;
      default:
        break;
    }
  }
}
