import React from 'react';

const Message = ({ message }) => {
  return (
    <div className="message">
      <p><strong>{message.username}:</strong> {message.message}</p>
    </div>
  );
};

export default Message;