import React, { useContext, useEffect, useState } from "react";
import "../../../styles/chat.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Context } from "../../store/appContext";
import Chat from "./chat.jsx";
import { useWebSocket } from "../../store/webSocketContext";
import useScreenWidth from "../../hooks/useScreenWidth.jsx";

const ChatList = () => {
    const { store, actions } = useContext(Context);
    const socket = useWebSocket();
    const [listOpen, setListOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [currentChat, setChat] = useState({});
    const smallDevice = useScreenWidth();

    useEffect(() => {
        actions.fetchChatsAndUnseenMessages();
    }, [store.user]);

    useEffect(() => {
        if (!socket || smallDevice) return;

        socket.on('new_chat', () => {
            actions.getChats();
        });

        socket.on('unseen_message', (data) => {
            actions.setUnseenMessages({ room: data.room, hasUnseenMessages: true }, true);
        });

        socket.on('online_users', (data) => {
            actions.setOnlineUsers(data.users);
        });

        return () => {
            socket.off('new_chat');
            socket.off('unseen_message');
            socket.off('online_users');
        };
    }, [socket, smallDevice]);

    useEffect(() => {
        for(let chat of store.chats) {
           socket.emit('join', { username: store.user.username, room: chat.room_name })
        }
    }, [store.chats]);

    const handleOpenChat = (chat) => {
        setChat(chat);
        setChatOpen(true);
        actions.setUnseenMessages({ room: chat.room_name, hasUnseenMessages: false }, true);
    }
    
    const handleCloseChat = () => {
        if (currentChat.room_name)  actions.setUnseenMessages({ room: currentChat.room_name, hasUnseenMessages: false }, true);
        setChat({});
        setChatOpen(false);
    }

    return(
        <div className="fixed-bottom">
            <div className="d-flex position-relative">
                { chatOpen && <Chat open={chatOpen} handleClose={handleCloseChat} chat={currentChat} isUserOnline={actions.isUserOnline(currentChat)} ></Chat> }
                <div className="card-messaging float-end position-absolute bottom-0 end-0 me-5"> 
                    <div className="card-m-header px-5 py-2 bg-light" onClick={() => { setListOpen(!listOpen); handleCloseChat(); }}>
                        <span className="text-muted"><b>Messaging</b> <Icon className="ms-2 me-5 fs-4" icon={`iconamoon:arrow-${listOpen ? 'up' : 'down'}-2-bold`} /></span>
                        {(!listOpen && Object.values(store.unseenMessages).some((value) => value)) && <span className="badge bg-danger ms-2">New</span>}
                    </div>
                    { listOpen && (
                        <div className="px-5 py-2 bg-white">
                            {store.chats.length === 0 ? (
                                <div>No chats available</div>
                            ) : (
                                store.chats?.map((chat) => (
                                    <div key={chat.id} className="d-flex py-2 border-bottom chat-item rounded" onClick={() => handleOpenChat(chat)}>
                                        <div>{chat.requester_user.id == store.user.id ? chat.seeker_user.username : chat.requester_user.username} for task {chat.task_id}</div>
                                        {actions.isUserOnline(chat) && (
                                            <span className="text-success ms-2">&#9679;</span>
                                        )}
                                        {(store.unseenMessages[chat.room_name] && chat != currentChat && !chatOpen) && <span className="badge bg-danger ms-2">New</span>}
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