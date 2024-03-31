import { ServerEvents } from './ServerEvents';

export type ServerPayloads = {
  [ServerEvents.LobbyState]: {
    lobbyId: string;
    maxClients: number;
    hasStarted: boolean;
    hasFinished: boolean;
    playersCount: number;
    isSuspended: boolean;
    players: any;
    characteristics: any;
    conditions: any;
    isPrivate: boolean;
    currentStage: number;
    stages: any[];
    revealPlayerId: string;
    voteKickList: any[];
  };

  [ServerEvents.GameMessage]: {
    message: string;
    color?: 'green' | 'red' | 'blue' | 'orange';
  };
};
