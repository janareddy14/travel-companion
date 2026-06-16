import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { token, isLoggedIn } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    if (!isLoggedIn || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => console.log('Socket connected'));
    newSocket.on('user_online', (userId) => setOnlineUsers(prev => new Set(prev).add(userId)));
    newSocket.on('user_offline', (userId) => setOnlineUsers(prev => {
      const s = new Set(prev);
      s.delete(userId);
      return s;
    }));
    newSocket.on('unread_update', (counts) => setUnreadCounts(counts));
    newSocket.on('disconnect', () => console.log('Socket disconnected'));

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [isLoggedIn, token]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, unreadCounts }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext) || {};
}
