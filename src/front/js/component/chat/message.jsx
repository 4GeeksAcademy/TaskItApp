import React, { useEffect, useContext } from 'react';
import { Context } from '../../store/appContext';

const Message = ({ message, markMessageAsSeen }) => {
    const { store } = useContext(Context);

    useEffect(() => {
        markMessageAsSeen(message.id)
    }, []);

    return (
        <div className={`row border rounded col-11 my-2 mx-1 p-1 text-white ${(message.sender_user.username == store.user.username || message.username == store.user.username) ? "float-end bg-primary" : "bg-secondary"}`}>
            <span>{message.message}</span>
        </div>
    );
};

export default Message;