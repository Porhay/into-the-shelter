export enum ClientEvents {
  Ping = 'client.ping',
  LobbyCreate = 'client.lobby.create',
  LobbyUpdate = 'client.lobby.update',
  LobbyJoin = 'client.lobby.join',
  LobbyLeave = 'client.lobby.leave',
  GameStart = 'client.game.start',
  GameRevealChar = 'client.game.reveal_char', // characteristic, i.e: gender, health etc..
  GameVoteKick = 'client.game.vote_kick',
}
