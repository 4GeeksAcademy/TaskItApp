import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Message from './message.jsx';

const socket = io(process.env.BACKEND_URL); 

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState(''); 
    const [room, setRoom] = useState('');
    useEffect(() => {
        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('message');
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message) {
            socket.emit('message', { username, message, room });
            setMessage('');
        }
    };

    const joinRoom = (e) => {
        e.preventDefault();
        if (username && room) socket.emit('join', { username, room });
    };

    return (
        <div>
            <form onSubmit={joinRoom}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="Room"
                />
                <button type="submit">Join Room</button>
            </form>

            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <Message key={index} message={msg} />
                ))}
            </div>

            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter message"
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;