export enum SocketExceptions {
  UnexpectedError = 'exception.unexpected_error',
  UnexpectedPayload = 'exception.unexpected_payload',
  LobbyError = 'exception.lobby.error',
  GameError = 'exception.game.error',
}
export type ServerExceptionResponse = {
  exception: SocketExceptions;
  message?: string | object;
};

export enum Events {
  Ping = 'client.ping',
  LobbyCreate = 'client.lobby.create',
  LobbyJoin = 'client.lobby.join',
  LobbyLeave = 'client.lobby.leave',
  GameRevealCard = 'client.game.reveal_card',

  Pong = 'server.pong',
  LobbyState = 'server.lobby.state',
  GameMessage = 'server.game.message',
}

export enum ServerEvents {
  Pong = 'server.pong',
  ChatMessage = 'server.chat.message',
  LobbyState = 'server.lobby.state',
  GameMessage = 'server.game.message',
}
export type ServerPayloads = {
  [ServerEvents.LobbyState]: {
    lobbyLink: string;
    isOrganizator: boolean | undefined;
    lobbyId: string;
    mode: 'solo' | 'duo';
    delayBetweenRounds: number;
    hasStarted: boolean;
    hasFinished: boolean;
    currentRound: number;
    playersCount: number;
    cards: any;
    isSuspended: boolean;
    scores: Record<string, number>;
    players: any;
    characteristics: any;
    conditions: any;
    currentStage: number;
    stages: any[];
    revealPlayerId: string;
  };

  [ServerEvents.GameMessage]: {
    message: string;
    color?: 'green' | 'red' | 'blue' | 'orange';
  };
};

export enum ClientEvents {
  Ping = 'client.ping',
  LobbyCreate = 'client.lobby.create',
  LobbyUpdate = 'client.lobby.update',
  LobbyJoin = 'client.lobby.join',
  LobbyLeave = 'client.lobby.leave',
  GameRevealCard = 'client.game.reveal_card',
  GameStart = 'client.game.start',
  GameRevealChar = 'client.game.reveal_char', // characteristic, i.e: gender, health etc..
  GameVoteKick = 'client.game.vote_kick',
}
