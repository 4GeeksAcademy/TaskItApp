import React, { useState, useEffect, useContext } from 'react';
import Message from './message.jsx';
import { Context } from "../../store/appContext.js"
import { Card, Form, Button, Spinner } from 'react-bootstrap';
import { useWebSocket } from '../../store/webSocketContext.js';

const Chat = (props) => {
    const { store, actions } = useContext(Context);
    const socket = useWebSocket();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(process.env.BACKEND_URL + `/api/chats/${props.chat.id}/messages`);
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

        setLoading(true);
        fetchMessages();

        if (!socket) return;

        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            scrollToBottom();
        });

        return () => {
            socket.off('message');
        };
    }, [props.chat, socket]);

    const scrollToBottom = () => {
        const chatContainer = document.querySelector('.chat-content');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (message) {
            const uniqueId = actions.generateUniqueId(); 
            socket.emit('message', { client_generated_id: uniqueId, username: store.user.username, message, room: props.chat.room_name }); 
            const config = {
                method: "POST",
                body: JSON.stringify({ client_generated_id: uniqueId, message, sender_id: store.user.id }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };

            fetch(process.env.BACKEND_URL + `/api/chats/${props.chat.id}/messages`, config)
            .catch(error => console.error(error));

            setMessage('');
        }
    };

    function markMessageAsSeen(message_id) {
        if(message_id) socket.emit('mark_message_as_seen', { message_id: message_id, user_id: store.user.id });
    }

    return (
        <Card className='position-absolute bottom-0 start-70 card-messaging chat'>
             <Card.Header className='d-flex justify-content-between align-items-center'>
                <div className='d-flex flex-row align-items-center'>
                    <div className="rounded-circle bg-dark me-2 overflow-hidden" style={{ height: "40px", width: "40px", aspectRatio: "1/1" }}>
                            {(props.chat.requester_user.id == store.user.id ? props.chat.seeker_user.profile_picture : props.chat.requester_user.profile_picture) && <img
                            className="img-fluid"
                            src={(props.chat.requester_user.id == store.user.id ? props.chat.seeker_user.profile_picture : props.chat.requester_user.profile_picture)}
                            alt="User Profile"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />}
                    </div>
                    <div className='d-flex flex-column justify-content-center'>
                        <h5 className="mb-0">{props.chat.requester_user.id == store.user.id ? props.chat.seeker_user.username : props.chat.requester_user.username} for task {props.chat.task_id}</h5>
                        <small>{props.isUserOnline ? "Online" : "Offline"}</small>
                    </div>
                </div>
                <Button onClick={props.handleClose} variant="" className="close p-0" aria-label="Close">
                    <span className="fs-3" aria-hidden="true">&times;</span>
                </Button>
            </Card.Header>

            <Card.Body className="chat-content container-fluid d-flex flex-column">
                { loading 
                    ? <div className="spinner-container">
                        <Spinner animation="border" variant="dark" />
                    </div>
                    : (messages.map((msg, index) => (
                    msg.room_name === props.chat.room_name && (
                        <Message
                            key={index + 'msg'}
                            message={msg}
                            markMessageAsSeen={markMessageAsSeen}
                        />
                    )
                )))}
            </Card.Body>
            <Card.Footer>
                <Form className="d-flex p-1" onSubmit={sendMessage}>
                    <Form.Control
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter message"
                    />
                </Form>
            </Card.Footer>
        </Card>
    );
};

export default Chat;