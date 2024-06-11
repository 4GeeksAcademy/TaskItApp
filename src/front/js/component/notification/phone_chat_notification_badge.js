import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../store/appContext';

const ChatNotification = () => {
    const { store, actions } = useContext(Context);

    const [unseenMessages, setUnseenMessages] = useState({});

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
    }, []);

    useEffect(() => {
        store.socket.on('unseen_message', (data) => {
            setUnseenMessages(prev => ({ ...prev, [data.room]: true }));
        });
        
        store.socket.on('new_chat', () => {
            actions.getChats();
        });

        return () => {
            store.socket.off('unseen_message');
            store.socket.off('new_chat');
        };
    }, [store.socket]);

    useEffect(() => {
        for(let chat of store.chats) {
            store.socket.emit('join', { username: store.user.username, room: chat.room_name })
        }
    }, [store.chats]);

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

    return (
        <div>
            { Object.values(unseenMessages).some((value) => value) && 
                <span className="position-absolute top-0 end-0 badge rounded-pill bg-danger text-danger" style={{ fontSize: "0.6rem" }}>
                    .
                </span>
            }
        </div>
    );
}

export default ChatNotification;