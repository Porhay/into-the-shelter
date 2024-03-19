import { Cards } from './Cards';
import { SocketExceptions } from './SocketExceptions';

export type CardStateDefinition = {
  card: Cards | null;
  owner: string | null;
};

export type ServerExceptionResponse = {
  exception: SocketExceptions;
  message?: string | object;
};