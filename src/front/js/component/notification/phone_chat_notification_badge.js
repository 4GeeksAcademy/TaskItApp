import React, { useContext } from 'react';
import { Context } from '../../store/appContext';

const ChatNotification = () => {
    const { store } = useContext(Context);
    return (
        <div>
            { Object.values(store.unseenMessages).some((value) => value) && 
                <span className="position-absolute top-0 end-0 badge rounded-pill bg-danger text-danger" style={{ fontSize: "0.6rem" }}>
                     .
                </span>
            }
        </div>
    );
};

export default ChatNotification;