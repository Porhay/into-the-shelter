export enum ClientEvents {
  Ping = 'client.ping',
  LobbyCreate = 'client.lobby.create',
  LobbyUpdate = 'client.lobby.update',
  LobbyJoin = 'client.lobby.join',
  LobbyLeave = 'client.lobby.leave',
  GameStart = 'client.game.start',
  GameRevealChar = 'client.game.reveal_char', // characteristic, i.e: gender, health etc..
  GameEndTurn = 'client.game.end_turn',
  GameVoteKick = 'client.game.vote_kick',
  GameUseSpecialCard = 'client.game.use_special_card',
  ChatMessage = 'client.chat.message',
}
