import { io } from 'socket.io-client';

const token = process.env.API_TOKEN;

export const socket = io(process.env.API_URL!, {
  auth: { token },
  autoConnect: !!token,
});
