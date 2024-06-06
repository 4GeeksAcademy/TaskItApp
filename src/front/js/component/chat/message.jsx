import React from 'react';

const Message = ({ message }) => {
  return (
    <div className="message">
      <p><strong>{message.username || message.sender_user.username}:</strong> {message.message}</p>
    </div>
  );
};

export default Message;