import { ServerEvents } from './ServerEvents';
import { CardStateDefinition } from './types';

export type ServerPayloads = {
  [ServerEvents.LobbyState]: {
    lobbyId: string;
    maxClients: number;
    hasStarted: boolean;
    hasFinished: boolean;
    currentRound: number;
    playersCount: number;
    cards: CardStateDefinition[];
    isSuspended: boolean;
    scores: Record<string, number>;
    players: any;
    characteristics: any;
  };

  [ServerEvents.GameMessage]: {
    message: string;
    color?: 'green' | 'red' | 'blue' | 'orange';
  };
};
