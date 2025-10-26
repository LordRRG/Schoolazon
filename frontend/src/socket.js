import { io } from 'socket.io-client';

// Create socket; actual connection will be used when joining a community.
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || (process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api','') : 'http://localhost:5000');
const socket = io(SOCKET_URL, { autoConnect: false });

export default socket;
