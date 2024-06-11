import React, { useContext, useEffect, useState } from "react";
import "../../../styles/chat.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Context } from "../../store/appContext";
import Chat from "./chat.jsx";
import { useWebSocket } from "../../store/webSocketContext";

const ChatList = () => {
    const { store, actions } = useContext(Context);
    const socket = useWebSocket();
    const [listOpen, setListOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [currentChat, setChat] = useState({});
    const [unseenMessages, setUnseenMessages] = useState({});
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const fetchChatsAndUnseenMessages = async () => {
            await actions.getChats();
            const unseenMessagesStatus = {};
            for (const chat of store.chats) {
                const hasUnseenMessages = await checkUnseenMessages(store.user.id, chat.id);
                unseenMessagesStatus[chat.room_name] = hasUnseenMessages;
            }
            setUnseenMessages(unseenMessagesStatus);
        };
        fetchChatsAndUnseenMessages();
    }, [store.user]);

    useEffect(() => {
        if (!socket) return;

        socket.on('new_chat', () => {
            actions.getChats();
        });

        socket.on('unseen_message', (data) => {
            setUnseenMessages(prev => ({ ...prev, [data.room]: true }));
        });

        socket.on('online_users', (data) => {
            setOnlineUsers(data.users);
        });

        return () => {
            socket.off('new_chat');
            socket.off('unseen_message');
            socket.off('online_users');
        };
    }, [socket, actions]);

    useEffect(() => {
        for(let chat of store.chats) {
           socket.emit('join', { username: store.user.username, room: chat.room_name })
        }
    }, [store.chats]);

    const handleOpenChat = (chat) => {
        setChat(chat);
        setChatOpen(true);
        setUnseenMessages(prev => ({ ...prev, [chat.room_name]: false }));
    }

    const handleCloseChat = () =>  {
        setUnseenMessages(prev => ({ ...prev, [currentChat.room_name]: false }));
        setChat({});
        setChatOpen(false);
    }

    const isUserOnline = (chat) => {
        const otherUser = chat.requester_user.id === store.user.id ? chat.seeker_user.username : chat.requester_user.username;
        return onlineUsers.includes(otherUser);
    };

    const checkUnseenMessages = async (userId, chatId) => {
        try {
            const res = await fetch(`${process.env.BACKEND_URL}/api/users/${userId}/chats/${chatId}`, {});
            const data = await res.json();
            return data.has_unseen_messages;
        } catch (error) {
            console.error("Error checking unseen messages:", error);
            return false;
        }
    }

    return(
        <div className="fixed-bottom">
            <div className="d-flex position-relative">
                { chatOpen && <Chat open={chatOpen} handleClose={handleCloseChat} chat={currentChat} isUserOnline={isUserOnline(currentChat)} ></Chat> }
                <div className="card-messaging float-end position-absolute bottom-0 end-0 me-5"> 
                    <div className="card-m-header px-5 py-2 bg-light" onClick={() => { setListOpen(!listOpen); handleCloseChat(); }}>
                        <span className="text-muted"><b>Messaging</b> <Icon className="ms-2 me-5 fs-4" icon={`iconamoon:arrow-${listOpen ? 'up' : 'down'}-2-bold`} /></span>
                        {(!listOpen && Object.values(unseenMessages).some((value) => value)) && <span className="badge bg-danger ms-2">New</span>}
                    </div>
                    { listOpen && (
                        <div className="px-5 py-2 bg-white">
                            {store.chats.length === 0 ? (
                                <div>No chats available</div>
                            ) : (
                                store.chats?.map((chat) => (
                                    <div key={chat.id} className="d-flex py-2 border-bottom chat-item rounded" onClick={() => handleOpenChat(chat)}>
                                        <div>{chat.requester_user.id == store.user.id ? chat.seeker_user.username : chat.requester_user.username} for task {chat.task_id}</div>
                                        {isUserOnline(chat) && (
                                            <span className="text-success ms-2">&#9679;</span>
                                        )}
                                        {(unseenMessages[chat.room_name] && chat != currentChat && !chatOpen) && <span className="badge bg-danger ms-2">New</span>}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatList;