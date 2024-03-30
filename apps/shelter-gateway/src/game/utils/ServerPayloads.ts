import { ServerEvents } from './ServerEvents';
import { CardStateDefinition } from './types';

export type ServerPayloads = {
  [ServerEvents.LobbyState]: {
    lobbyId: string;
    maxClients: number;
    hasStarted: boolean;
    hasFinished: boolean;
    currentRound: number; // depricated
    playersCount: number;
    cards: CardStateDefinition[]; // depricated
    isSuspended: boolean;
    scores: Record<string, number>; // depricated
    players: any;
    characteristics: any;
    conditions: any;
    isPrivate: boolean;
    currentStage: number;
    stages: any[];
  };

  [ServerEvents.GameMessage]: {
    message: string;
    color?: 'green' | 'red' | 'blue' | 'orange';
  };
};
