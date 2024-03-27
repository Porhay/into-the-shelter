export enum ClientEvents {
  Ping = 'client.ping',
  LobbyCreate = 'client.lobby.create',
  LobbyJoin = 'client.lobby.join',
  LobbyLeave = 'client.lobby.leave',
  GameRevealCard = 'client.game.reveal_card',
  GameStart = 'client.game.start',
  GameRevealChar = 'client.game.reveal_char', // characteristic, i.e: gender, health etc..
}
