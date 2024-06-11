import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Context } from './appContext';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { store } = useContext(Context);

    useEffect(() => {
        const newSocket = io(process.env.BACKEND_URL, {
            query: { username: store.user?.username }
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to server');
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        newSocket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [store.user?.username]);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);