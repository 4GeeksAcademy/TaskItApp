import React, { useContext } from 'react';
import { Context } from '../../store/appContext';
import { useLocation } from 'react-router-dom';

const ChatNotification = () => {
    const { store } = useContext(Context);
    const path = useLocation().pathname;
    const isChat = /^\/chats\/\d+$/.test(path);

    return (
        <div>
            { (Object.values(store.unseenMessages).some((value) => value) && path != '/chat' && !isChat) && 
                <span className="position-absolute top-0 end-0 badge rounded-pill bg-danger text-danger" style={{ fontSize: "0.6rem" }}>
                     .
                </span>
            }
        </div>
    );
};

export default ChatNotification;