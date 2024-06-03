import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const Notification = () => {
    const socket = io(process.env.BACKEND_URL);  
    const [messages, setMessages] = useState([]);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
        });
    
        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
    
        socket.on('response_event', (data) => {
            console.log('Response from server:', data);
        });
    
        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        socket.on('notification', (data) => {
            try {
                console.log('Received notification:', data);
                setNotifications((prevNotifications) => [...prevNotifications, data.message]);
            } catch (error) {
                console.error('Error handling notification:', error);
            }
        });
  
        return () => {
            socket.off('connect');
            socket.off('message');
            socket.off('notification');
            socket.off('response_event');
            socket.off('disconnect');
        };
    }, []);
  
    const sendMessage = () => {
        socket.send('Hello from React');
    };
  
    const sendCustomEvent = () => {
        socket.emit('custom_event', { data: 'Hello, Flask!' });
    };
  
    return (
        <div>
            {notifications.length > 0 && <span className="badge badge-pill badge-danger">{notifications.length}</span>}
        </div>
    );
}
  

export default Notification;