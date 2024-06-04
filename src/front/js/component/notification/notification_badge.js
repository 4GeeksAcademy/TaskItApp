import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Context } from '../../store/appContext';

const Notification = () => {
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const { store } = useContext(Context);

    useEffect(() => {
        const newSocket = io(process.env.BACKEND_URL);
        console.log("Connecting to", process.env.BACKEND_URL);
        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('connect', () => {
            console.log('Connected to server'); 
            socket.emit('join', { room: store.user.username, username: store.user.username });
        });

        socket.on('notification', (data) => {
            console.log("Received notification:", data);
            try {
                setNotifications((prevNotifications) => [...prevNotifications, data.message]);
            } catch (error) {
                console.error('Error handling notification:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        return () => {
            socket.off('connect');
            socket.off('notification');
            socket.off('disconnect');
            socket.off('error');
        };
    }, [socket]);

    return (
        <div>
            {notifications.length > 0 && (
                <span className="position-absolute top-0 end-0 badge rounded-pill bg-danger" style={{ fontSize: "0.6rem" }}>
                    {notifications.length}
                </span>
            )}
        </div>
    );
}

export default Notification;