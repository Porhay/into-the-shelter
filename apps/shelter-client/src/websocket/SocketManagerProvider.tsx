import React, { createContext } from 'react';
import SocketManager from './SocketManager';

const socketManager = new SocketManager();
export const SocketManagerContext = createContext<SocketManager>(socketManager);

type ProviderProps = { children: React.ReactNode };
export function SocketManagerProvider({
  children,
}: ProviderProps): JSX.Element {
  return (
    <SocketManagerContext.Provider value={socketManager}>
      {children}
    </SocketManagerContext.Provider>
  );
}
