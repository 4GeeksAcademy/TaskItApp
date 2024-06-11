import React, { useContext, useEffect, useState } from "react";
import "../../styles/chat.css"
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const PhoneChatList = () => {
    const { store, actions } = useContext(Context);

    const [unseenMessages, setUnseenMessages] = useState({});
    const [onlineUsers, setOnlineUsers] = useState([]);

    const navigate = useNavigate()

    useEffect(() => {
        const fetchChatsAndUnseenMessages = async () => {
            await actions.getChats();
            const unseenMessagesStatus = {};
            for (const chat of store.chats) {
                const hasUnseenMessages = await checkUnseenMessages(store.user.id, chat.id);
                unseenMessagesStatus[chat.room_name] = hasUnseenMessages;
                console.log(hasUnseenMessages)
            }
            setUnseenMessages(unseenMessagesStatus);
        };
        fetchChatsAndUnseenMessages();
    }, [store.user]);

    useEffect(() => {
        store.socket.on('new_chat', () => {
            actions.getChats();
        });

        store.socket.on('unseen_message', (data) => {
            setUnseenMessages(prev => ({ ...prev, [data.room]: true }));
            console.log(data)
        });

        store.socket.on('online_users', (data) => {
            setOnlineUsers(data.users);
        });

        return () => {
            store.socket.off('new_chat');
            store.socket.off('unseen_message');
            store.socket.off('online_users');
        };
    }, [store.socket]);

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
        <div className="container-fluid">
            <div className="row px-5">
                {store.chats.length === 0 ? (
                    <div>No chats available</div>
                ) : (
                    store.chats?.map((chat) => (
                        <div key={chat.id + "pchat"} className="card p-3 chat-item" onClick={() => navigate(`/chats/${chat.id}`)}>
                            <div>
                                {chat.requester_user.id == store.user.id ? chat.seeker_user.username : chat.requester_user.username} for task {chat.task_id}
                                {isUserOnline(chat) && (
                                    <span className="text-success ms-2">&#9679;</span>
                                )}
                                {unseenMessages[chat.room_name] && <span className="badge bg-danger ms-2 w-auto">New</span>}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default PhoneChatList;