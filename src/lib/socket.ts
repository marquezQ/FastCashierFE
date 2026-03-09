import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : 'http://localhost:3000';

export const ordersSocket: Socket = io(`${SOCKET_URL}/orders`, {
    autoConnect: true,
    transports: ['websocket'],
});
