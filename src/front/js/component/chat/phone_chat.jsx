import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import Message from './message.jsx';
import { Context } from "../../store/appContext.js"
import { Form, Spinner } from 'react-bootstrap';
import { useWebSocket } from '../../store/webSocketContext.js';
import useScreenWidth from '../../hooks/useScreenWidth.jsx';
import TypingAnimation from './typing_animation.jsx';

const PhoneChat = () => { 
    const { store, actions } = useContext(Context);
    const socket = useWebSocket();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const { chatid } = useParams(); 
    const smallDevice = useScreenWidth();
    const navigate = useNavigate();
    const [typingUsers, setTypingUsers] = useState({});

    useEffect(() => {
        setLoading(true);
        fetchMessages();

        if (!socket) return;

        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            scrollToBottom();
        });
        
        socket.on('typing_status', ({ room, users }) => {
            setTypingUsers((prevTypingUsers) => ({
                ...prevTypingUsers,
                [room]: users,
            }));
        });

        return () => {
            socket.off('message');
            socket.off('typing_status');            
            handleStopTyping();
            actions.setUnseenMessages({ room: store.currentChat.room_name, hasUnseenMessages: false }, true);
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

    const fetchMessages = async () => {
        try {
            const response = await fetch(process.env.BACKEND_URL + `/api/chats/${chatid}/messages`);
            const data = await response.json();
            setMessages(data.slice().sort((a, b) => {
                const dateA = new Date(a.timestamp);
                const dateB = new Date(b.timestamp);
                return dateA - dateB;
            }));
            setLoading(false);
            scrollToBottom();
        } catch (error) {
            console.error(error);
        }
    };
    
    const sendMessage = (e) => {
        e.preventDefault();
        if (message) {
            const uniqueId = actions.generateUniqueId();
            socket.emit('message', { client_generated_id: uniqueId, username: store.user?.username, message, room: store.currentChat?.room_name }); 
            const config = {
                method: "POST",
                body: JSON.stringify({ client_generated_id: uniqueId, message, sender_id: store.user.id }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };

            fetch(process.env.BACKEND_URL + `/api/chats/${store.currentChat?.id}/messages`, config)
            .catch(error => console.error(error));

            handleStopTyping();
            setMessage('');
        }
    };

    function markMessageAsSeen(message_id) {
        if(message_id) socket.emit('mark_message_as_seen', { message_id: message_id, user_id: store.user.id });
        if(store.currentChat?.room_name) actions.setUnseenMessages({ room: store.currentChat?.room_name, hasUnseenMessages: false }, true);
    }

    const handleTyping = () => {
        socket.emit('typing', { username: store.user?.username, room: store.currentChat.room_name });
    };

    const handleStopTyping = () => {
        socket.emit('stop_typing', { username: store.user?.username, room: store.currentChat.room_name });
    };

    const handleOnChange = (e) => {
        setMessage(e.target.value);
        if(e.target.value.length > 0) handleTyping();
        else handleStopTyping();
    };

    return (
        <div className="phone-chat-container d-flex flex-column p-0 bg-light">
            <hr></hr>
            <div className="chat-header bg-light px-5 d-flex align-items-center">
                <div className='d-flex flex-row align-items-center'>
                    <div className="rounded-circle bg-dark me-2 overflow-hidden" style={{ height: "40px", width: "40px", aspectRatio: "1/1" }}>
                        {(store.currentChat?.requester_user.id == store.user.id ? store.currentChat?.seeker_user.profile_picture : store.currentChat?.requester_user.profile_picture) && <img
                        className="img-fluid"
                        src={(store.currentChat?.requester_user.id == store.user.id ? store.currentChat?.seeker_user.profile_picture : store.currentChat?.requester_user.profile_picture)}
                        alt="User Profile"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />}
                    </div>
                    <div className='d-flex flex-column justify-content-center'>
                        <h5 className="mb-0">{store.currentChat.requester_user.id == store.user.id ? store.currentChat.seeker_user.username : store.currentChat.requester_user.username} for task {store.currentChat.task_id}</h5>
                        <small>
                            {actions.isUserOnline(store.currentChat) ? (
                                ((typingUsers[store.currentChat.room_name]?.length > 0 && !typingUsers[store.currentChat.room_name]?.some((user) => user === store.user?.username))
                                || typingUsers[store.currentChat.room_name]?.length == 2)
                                    ? (
                                        <>
                                            is typing
                                            <TypingAnimation />
                                        </>
                                    ) : (
                                        'Online'
                                    )
                            ) : 'Offline'}
                        </small>
                    </div>
                </div>
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
                        onChange={(e) => handleOnChange(e)}
                        placeholder="Enter message"
                    />
                </Form>
            </div>
        </div>
    );
};

export default PhoneChat;