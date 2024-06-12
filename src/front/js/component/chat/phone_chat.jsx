import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import Message from './message.jsx';
import { Context } from "../../store/appContext.js"
import { Form, Spinner } from 'react-bootstrap';
import { useWebSocket } from '../../store/webSocketContext.js';
import useScreenWidth from '../../hooks/useScreenWidth.jsx';

const PhoneChat = () => { 
    const { store, actions } = useContext(Context);
    const socket = useWebSocket();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const { chatid } = useParams(); 
    const smallDevice = useScreenWidth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(process.env.BACKEND_URL + `/api/chats/${chatid}/messages`);
                const data = await response.json();
                setMessages(data);
                setLoading(false);
                scrollToBottom();
            } catch (error) {
                console.error(error);
            }
        };

        setLoading(true);
        fetchMessages();

        if (!socket) return;

        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            scrollToBottom();
        });

        return () => {
            socket.off('message');
            actions.setCurrentChat(null);
        };
    }, [store.currentChat, socket]);

    useEffect(() => {
        if(!smallDevice) navigate('/');
    }, [smallDevice])

    const scrollToBottom = () => {
        const chatContainer = document.querySelector('.chat-content');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (message) {
            socket.emit('message', { username: store.user.username, message, room: store.currentChat?.room_name }); 
            const config = {
                method: "POST",
                body: JSON.stringify({ message, sender_id: store.user.id }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };

            fetch(process.env.BACKEND_URL + `/api/chats/${store.currentChat?.id}/messages`, config)
            .catch(error => console.error(error));

            setMessage('');
        }
    };

    function markMessageAsSeen(message_id) {
        if(message_id) socket.emit('mark_message_as_seen', { message_id: message_id, user_id: store.user.id });
        if(store.currentChat?.room_name) actions.setUnseenMessages({ room: store.currentChat?.room_name, hasUnseenMessages: false }, true);
    }

    return (
        <div className="phone-chat-container d-flex flex-column p-0 bg-light">
            <hr></hr>
            <div className="chat-header bg-light px-5">
                <h5>{store.currentChat?.requester_user?.id == store.user.id ? store.currentChat?.seeker_user?.username : store.currentChat?.requester_user?.username} for task {store.currentChat?.task_id}</h5>
                { store.currentChat?.isUserOnline && <span className="badge bg-success ms-2">Online</span>}
            </div>
            <hr></hr>

            <div className="flex-grow-1 bg-light px-2 chat-content container-fluid d-flex flex-column">
                { loading 
                    ? (<div className="spinner-container">
                            <Spinner animation="border" variant="dark" />
                        </div>
                    ) : (messages.map((msg, index) => (
                        msg.room_name === store.currentChat?.room_name && ( 
                            <Message
                                key={index + 'msgp'}
                                message={msg}
                                markMessageAsSeen={markMessageAsSeen}
                            />
                    ))))}
            </div>

            <div className="p-2 bg-light">
                <Form onSubmit={sendMessage}>
                    <Form.Control
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter message"
                    />
                </Form>
            </div>
        </div>
    );
};

export default PhoneChat;