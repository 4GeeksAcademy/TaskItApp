import React, { useContext, useEffect, useState } from "react";
import "../../../styles/chat.css"
import { Icon } from "@iconify/react/dist/iconify.js";
import { Context } from "../../store/appContext";
import Chat from "./chat.jsx";

const ChatList = () => {
    const { store, actions } = useContext(Context);

    const [listOpen, setListOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [chat, setChat] =useState({});

    useEffect(() => {
        store.socket.on('new_chat', () => {
            actions.getChats();
        });

        return () => {
            store.socket.off('new_chat');
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
    }

    return(
        <div className="fixed-bottom">
            <div className="d-flex position-relative">
                { chatOpen && <Chat open={chatOpen} setOpen={setChatOpen} chat={chat} ></Chat> }
                <div className="card-messaging float-end position-absolute bottom-0 end-0 me-5"> 
                    <div className="card-m-header px-5 py-2 bg-light" onClick={() => setListOpen(!listOpen)}>
                        <span className="text-muted"><b>Messaging</b> <Icon className="ms-2 me-5 fs-4" icon={`iconamoon:arrow-${listOpen ? 'up' : 'down'}-2-bold`} /></span>
                    </div>
                    { listOpen && (
                        <div className="px-5 py-2 border-bottom mb-0 chat-item">
                            {store.chats.length === 0 ? (
                                <div>No chats available</div>
                            ) : (
                                store.chats.map(chat => (
                                    <div key={chat.id}  onClick={() => handleOpenChat(chat)}>{chat.requester_user.id == store.user.id ? chat.seeker_user.username : chat.requester_user.username} for task {chat.task_id}</div>
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