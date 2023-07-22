import React from 'react';
import { socket } from './socket.client';

export function useSocketAuth(token: string) {
  React.useEffect(() => {
    if (token && !socket.connected) {
      socket.auth = { token };
      socket.connect();
    }
    return () => {
      socket.close();
    };
  }, [token]);
}
