import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Context } from '../../store/appContext';

const Chat = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const { store } = useContext(Context);

    useEffect(() => {
        const newSocket = io(process.env.BACKEND_URL);
        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (!socket || Object.keys(store.user).length <= 0) return;

        socket.on('connect', () => {
            console.log('Connected to server'); 
        });

        socket.on('message', (data) => {
            console.log("Received message:", data);
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        return () => {
            socket.off('connect');
            socket.off('message');
            socket.off('disconnect');
            socket.off('error');
        };
    }, [socket, store.user]);

    const sendMessage = () => {
        if (messageInput.trim() !== '') {
            socket.emit('message', { text: messageInput, sender: store.user.username });
            setMessageInput('');
        }
    };

    return (
        <div>
            {store.notifications.length > 0 && (
                <span className="position-absolute top-0 end-0 badge rounded-pill bg-danger" style={{ fontSize: "0.6rem" }}>
                    {store.notifications.length}
                </span>
            )}
        </div>
    );
}

export default Chat;