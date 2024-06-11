import React, { useContext, useEffect, useState } from 'react';
import { useWebSocket } from '../../store/webSocketContext';
import { Context } from '../../store/appContext';

const ChatNotification = () => {
    const socket = useWebSocket();
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
    }, [actions, store.user]);

    useEffect(() => {
        if (!socket) return;

        socket.on('unseen_message', (data) => {
            setUnseenMessages(prev => ({ ...prev, [data.room]: true }));
        });

        socket.on('new_chat', () => {
            actions.getChats();
        });

        return () => {
            socket.off('unseen_message');
            socket.off('new_chat');
        };
    }, [socket, actions]);

    useEffect(() => {
        if (!socket || !store.chats.length) return;

        for (let chat of store.chats) {
            socket.emit('join', { username: store.user.username, room: chat.room_name });
        }
    }, [socket, store.chats, store.user.username]);

    const checkUnseenMessages = async (userId, chatId) => {
        try {
            const res = await fetch(`${process.env.BACKEND_URL}/api/users/${userId}/chats/${chatId}`);
            const data = await res.json();
            return data.has_unseen_messages;
        } catch (error) {
            console.error("Error checking unseen messages:", error);
            return false;
        }
    };

    return (
        <div>
            { Object.values(unseenMessages).some((value) => value) && 
                <span className="position-absolute top-0 end-0 badge rounded-pill bg-danger text-danger" style={{ fontSize: "0.6rem" }}>
                    .
                </span>
            }
        </div>
    );
};

export default ChatNotification;