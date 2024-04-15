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
  public finalPrediction: string = '';

  private charsRevealedCount: number = 0;
  private readonly charOpenLimit: number = 2; // per 1 player on every stage
  public timerEndTime: number | null = null

  constructor(
    private readonly lobby: Lobby,
  ) { }

  public async triggerStart(data: any, client: AuthenticatedSocket): Promise<void> {
    if (this.hasStarted) {
      return;
    }
    if (this.players.length < 2) {
      return this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
        ServerEvents.GameMessage,
        {
          color: 'blue',
          message: 'Find a friend to play :D',
        },
      );
    }

    // update lobby's settings
    const lobbydb = await this.lobby.databaseService.getLobbyByKeyOrNull(client.data.lobby.id);
    this.lobby.isPrivate = lobbydb.settings.isPrivate;
    this.lobby.maxClients = lobbydb.settings.maxClients;
    this.lobby.timer = lobbydb.settings.timer;

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
    for (let i = 1; i <= Math.floor(this.players.length / 2); i++) {
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

    // set timer for player
    this.setTimerIfRequired()

    // reveal here if bot
    await this.botActionIfRequired(client, 'reveal')

    this.lobby.dispatchLobbyState();
    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        color: 'blue',
        message: 'Game started!',
      },
    );
  }

  public async triggerFinish(): Promise<void> {
    if (this.hasFinished || !this.hasStarted) {
      return;
    }

    // generate prediction in background and set finalPrediction on finish
    this.lobby.AIService.generatePrediction({
      conditions: this.conditions,
      characteristics: this.characteristics,
      players: this.players,
    }).then((predictionStr) => {
      this.finalPrediction = predictionStr
      this.lobby.dispatchLobbyState();
    })

    // reveal all remained characteristics
    const revealAllCharacteristics = (): void => {
      // Iterate over each key in the map
      Object.keys(this.characteristics).forEach(key => {
        // Use forEach to update each characteristic in place
        this.characteristics[key].forEach(characteristic => {
          characteristic.isRevealed = true;  // Directly modify the characteristic object
        });
      });
    }
    revealAllCharacteristics()

    this.hasFinished = true;

    this.lobby.dispatchLobbyState();
    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        color: 'blue',
        message: 'Game finished! All characteristics revealed..',
      },
    );
  }

  public async revealChar(data: any, client: AuthenticatedSocket): Promise<void> {
    const { char, userId } = data;

    if (!this.hasStarted || this.hasFinished) {
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
    const uCharsRevealed = uCharList.filter((char: { isRevealed: boolean }) => char.isRevealed === true);

    // check if user not reveales one char multiple times
    if (uCharsRevealed.map(c => c.text).includes(char.text)) {
      return;
    }

    // check if user not reveales more chars then limited
    if (uCharsRevealed.length >= Math.ceil(this.currentStage / 2) * this.charOpenLimit) {
      return;
    }

    // update user's characteristic
    uCharList.find(
      (curChar: { type: any }) => curChar.type === char.type,
    ).isRevealed = true;
    this.characteristics[userId] = uCharList;
    this.charsRevealedCount = this.charsRevealedCount + 1;

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

  /**
   * Logic: By default player has endTurn=false.
   * Player revealed all remaining characteristics: endTurn=true.
   * If all players endTurn=true -> transit to the next stage
   * and update endTurn=false for all.
   * 
   * @param data 
   * @param client 
   * @returns Promise<void>
   */
  public async endTurn(data: any, client: AuthenticatedSocket): Promise<void> {
    const { userId } = data;

    if (!this.hasStarted || this.hasFinished) {
      return;
    }
    // kicked player can not end turn
    const isKicked = this.players.find(player => player.userId === userId).isKicked === true;
    if (isKicked) {
      return;
    }
    // end turn only on reveal stages
    if (this.currentStage % 2 === 0 || !isset(this.currentStage)) {
      return;
    }
    // only reveal player can end turn
    if (this.revealPlayerId !== userId) {
      return;
    }

    // update endTurn
    this.players.find(player => player.userId === userId).endTurn = true;

    /* Check if all the players ended the turn and if all reveals on current stage.
      Transit to the next stage, endTurn=false for all */
    const kicked = this.players.filter(player => player.isKicked);
    const allEnded = this.players.filter(_ => _.endTurn).length === this.players.length - kicked.length;
    // const allRevealsOnCurrentStage = this.charsRevealedCount >= this.charOpenLimit * (this.players.filter(_ => _.isKicked !== true).length);
    if (allEnded) {
      await this.transitNextStage(data, client)
      this.players.forEach(player => {
        player.endTurn = false;
      });
      await this.botActionIfRequired(client, 'voteKick')
      this.timerEndTime = null // resore timer
    } else {
      this.chooseNextToReveal(data, client)
      await this.botActionIfRequired(client, 'reveal')
    }

    this.lobby.dispatchLobbyState();
    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        color: 'blue',
        message: 'Player has finished his turn!',
      },
    );
  }

  public async voteKick(data: any, client: AuthenticatedSocket): Promise<void> {
    const { userId, contestantId } = data;

    if (!this.hasStarted || this.hasFinished) {
      return;
    }

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

      this.chooseNextToReveal(data, client)
      await this.transitNextStage(data, client);
      await this.botActionIfRequired(client, 'reveal')
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

  /* check if user revealed all possible characteristics and 
      choose next player that can reveal chars */
  private async chooseNextToReveal(data: any, client: AuthenticatedSocket): Promise<void> {
    const uCharList = this.characteristics[data.userId];
    const uCharsRevealed = uCharList.filter((char: { isRevealed: boolean }) => char.isRevealed === true);
    if (uCharsRevealed.length >= Math.ceil(this.currentStage / 2) * this.charOpenLimit) {
      const chooseNext = (revealPlayerId, attempt = 0) => {
        const totalPlayers = this.players.length;
        if (attempt >= totalPlayers) return null; // Base case to prevent infinite recursion

        const currentIndex = this.players.findIndex(p => p.userId === revealPlayerId);
        const revealPlayer = this.players[currentIndex + 1] || this.players[0];

        if (revealPlayer.isKicked) {
          // If the next player is kicked, recursively search for the next
          return chooseNext(revealPlayer.userId, attempt + 1);
        }
        return revealPlayer.userId;
      };

      this.revealPlayerId = chooseNext(this.revealPlayerId);

      // set timer for next player
      this.setTimerIfRequired()
    }
  }

  private setTimerIfRequired = () => {
    if (this.lobby.timer === 0 && this.currentStage % 2 !== 0) {
      return;
    }
    const timerEndTime = new Date();
    timerEndTime.setMinutes(timerEndTime.getMinutes() + this.lobby.timer);
    this.timerEndTime = timerEndTime.getTime();
    return timerEndTime;
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
      payload: { currentStage: this.currentStage }, // only currentStage needed
    });

    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        color: 'blue',
        message: `Stage ${this.currentStage} is started!`,
      },
    );
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

  private async botActionIfRequired(client: AuthenticatedSocket, action: 'reveal' | 'voteKick') {
    const curPlayer = this.players.find(p => p.userId === this.revealPlayerId);
    if (!curPlayer.isBot) {
      return;
    };
    if (curPlayer.isKicked) {
      return;
    }

    switch (action) {
      case 'reveal':
        const avaliableChars = this.characteristics[curPlayer.userId].filter(ch => !ch.isRevealed)
        for (let i = 0; i <= this.charOpenLimit; i++) {
          await this.revealChar({
            userId: curPlayer.userId,
            char: avaliableChars[getRandomIndex(avaliableChars.length)]
          }, client)
        }
        await this.endTurn({ userId: curPlayer.userId }, client)
        break;
      case 'voteKick':
        const contestants = this.players.filter(p => Object.keys(p) !== curPlayer.userId)
        await this.voteKick({
          userId: curPlayer.userId,
          contestantId: contestants[getRandomIndex(this.players.length)].userId
        }, client)
        break;
      default:
        break;
    }
  }
}
