import React, { useEffect } from 'react';

const Message = ({ message, markMessageAsSeen }) => {
    useEffect(() => {
        markMessageAsSeen(message.id)
    }, []);

    return (
        <div className="message">
            <p><strong>{message.username || message.sender_user.username}:</strong> {message.message}</p>
        </div>
    );
};

export default Message;