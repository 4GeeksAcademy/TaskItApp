import React, { useEffect, useContext } from 'react';
import { Context } from '../../store/appContext';

const Message = ({ message, markMessageAsSeen }) => {
    const { store } = useContext(Context);

    const isCurrentUserMessage = message && message.sender_user && message.sender_user.username === store.user.username;
    const isUserMessage = message && message.username && message.username === store.user.username;

    useEffect(() => {
        markMessageAsSeen(message.id)
    }, []);


    function formatISOTime(isoString) {
        if (!isoString) return;
    
        const date = new Date(isoString);
        const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
    
        return `${time}`;
    }
    

    return (
        <>
            { (isCurrentUserMessage || isUserMessage) 
                ? <div className="rounded my-2 mx-1 p-2 px-4 text-end bubble-green ms-auto d-flex flex-column" style={{ maxWidth: '83%' }}>
                    <span>{message.message}</span>
                    <small className="text-muted float-end">{formatISOTime(message.timestamp || new Date()) }</small>
                </div>
                : <div className="rounded my-2 mx-1 p-2 px-4 bubble-yellow me-auto d-flex flex-column" style={{ maxWidth: '83%' }}>
                    <span>{message.message}</span>
                    <small className="text-muted float-end">{formatISOTime(message.timestamp || new Date()) }</small>
                </div>
            }
        </>
    );
};

export default Message;