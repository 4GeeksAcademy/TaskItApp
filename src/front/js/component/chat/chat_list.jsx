import React, { useContext, useEffect, useState } from "react";
import "../../../styles/chat.css"
import { Icon } from "@iconify/react/dist/iconify.js";
import { Context } from "../../store/appContext";
import Chat from "./chat.jsx";

const ChatList = () => {
    const { store, actions } = useContext(Context);

    const [listOpen, setListOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [currentChat, setChat] =useState({});
    const [unseenMessages, setUnseenMessages] = useState({});

    useEffect(() => {
        store.socket.on('new_chat', () => {
            actions.getChats();
        });

        store.socket.on('unseen_message', (data) => {
            setUnseenMessages(prev => ({ ...prev, [data.room]: true }));
        });

        return () => {
            store.socket.off('new_chat');
            store.socket.off('unseen_message');
        };
    }, []);

    useEffect(() => {
        if (Object.keys(store.user).length > 0) {
            actions.getChats();
        }
    }, [store.user]);

    useEffect(() => {
        for(let chat of store.chats) {
            store.socket.emit('join', { username: store.user.username, room: chat.room_name })
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

    return(
        <div className="fixed-bottom">
            <div className="d-flex position-relative">
                { chatOpen && <Chat open={chatOpen} handleClose={handleCloseChat} chat={currentChat} ></Chat> }
                <div className="card-messaging float-end position-absolute bottom-0 end-0 me-5"> 
                    <div className="card-m-header px-5 py-2 bg-light" onClick={() => setListOpen(!listOpen)}>
                        <span className="text-muted"><b>Messaging</b> <Icon className="ms-2 me-5 fs-4" icon={`iconamoon:arrow-${listOpen ? 'up' : 'down'}-2-bold`} /></span>
                        {(!listOpen && Object.values(unseenMessages).some((value) => value)) && <span className="badge bg-danger ms-2">New</span>}
                    </div>
                    { listOpen && (
                        <div className="px-5 py-2">
                            {store.chats.length === 0 ? (
                                <div>No chats available</div>
                            ) : (
                                store.chats.map(chat => (
                                    <div key={chat.id} className="d-flex py-2 border-bottom chat-item" onClick={() => handleOpenChat(chat)}>
                                        <div>{chat.requester_user.id == store.user.id ? chat.seeker_user.username : chat.requester_user.username} for task {chat.task_id}</div>
                                        {(unseenMessages[chat.room_name] && chat != currentChat) && <span className="badge bg-danger ms-2">New</span>}
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