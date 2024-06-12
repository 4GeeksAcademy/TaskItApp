import React, { useContext } from "react";
import "../../styles/chat.css";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const PhoneChatList = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    return(
        <div className="container-fluid d-flex flex-column" style={{ height: '100vh'}}>
            <div className="flex-grow-1  h-100">
                <div className="row px-5">
                    {store.chats.length === 0 ? (
                        <div>No chats available</div>
                    ) : (
                        store.chats?.map((chat) => (
                            <div key={chat.id + "pchat"} className="card p-3 chat-item" onClick={() => {navigate(`/chats/${chat.id}`); actions.setCurrentChat(chat); }}>
                                <div>
                                    {chat.requester_user.id == store.user.id ? chat.seeker_user.username : chat.requester_user.username} for task {chat.task_id}
                                    {actions.isUserOnline(chat) && (
                                        <span className="text-success ms-2">&#9679;</span>
                                    )}
                                    {store.unseenMessages[chat.room_name] && <span className="badge bg-danger ms-2 w-auto">New</span>}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default PhoneChatList;