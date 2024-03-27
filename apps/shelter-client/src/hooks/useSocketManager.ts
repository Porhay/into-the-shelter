import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { SocketManagerContext } from '../websocket/SocketManagerProvider';

export default function useSocketManager() {
  const app = useSelector((state: RootState) => state.app);
  const sm = useContext(SocketManagerContext);
  const socket = app.sockets;
  return { sm, socket };
}
