import React, { useContext, useEffect } from 'react';
import { useWebSocket } from '../../store/webSocketContext';
import { Context } from '../../store/appContext';

const Notification = () => {
    const socket = useWebSocket();
    const { store, actions } = useContext(Context);

    useEffect(() => {
        if (!socket || !store.user.username) return;

        socket.emit('join', { room: store.user.username, username: store.user.username });

        socket.on('notification', () => {
            actions.getNotifications();
            actions.getChats();
        });

        return () => {
            socket.off('notification');
        };
    }, [socket, store.user, actions]);

    return (
        <div>
            {store.notifications.length > 0 && (
                <span className="position-absolute top-0 end-0 badge rounded-pill bg-danger" style={{ fontSize: "0.6rem" }}>
                    {store.notifications.length}
                </span>
            )}
        </div>
    );
};

export default Notification;