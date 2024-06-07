import React, { useEffect, useContext } from 'react';
import { Context } from '../../store/appContext';

const Message = ({ message, markMessageAsSeen }) => {
    const { store } = useContext(Context);

    const isCurrentUserMessage = message && message.sender_user && message.sender_user.username === store.user.username;
    const isUserMessage = message && message.username && message.username === store.user.username;

    useEffect(() => {
        markMessageAsSeen(message.id)
    }, []);

    return (
        <div className={`row border rounded col-11 my-2 mx-1 p-1 text-white ${(isCurrentUserMessage || isUserMessage) ? "float-end bg-primary" : "bg-secondary"}`}>
            <span>{message.message}</span>
        </div>
    );
};

export default Message;