import { io } from 'socket.io-client';

const token = window.token;

export const socket = io(process.env.API_URL!, {
  auth: { token },
  autoConnect: !!token,
});
