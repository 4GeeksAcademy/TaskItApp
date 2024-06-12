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
                    {store.chats.length === 0 
                        ? (<div>No chats available</div>
                        ) : ( store.chats?.map((chat) => (
                            <div key={chat.id} className="d-flex p-2 border-bottom chat-item rounded align-items-center" onClick={() => {navigate(`/chats/${chat.id}`); actions.setCurrentChat(chat); }}>
                                <div className="rounded-circle bg-dark me-2 overflow-hidden" style={{ height: "40px", width: "40px", aspectRatio: "1/1" }}>
                                    {(chat.requester_user.id == store.user.id ? chat.seeker_user.profile_picture : chat.requester_user.profile_picture) && <img
                                    className="img-fluid"
                                    src={(chat.requester_user.id == store.user.id ? chat.seeker_user.profile_picture : chat.requester_user.profile_picture)}
                                    alt="User Profile"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />}
                                </div>
                            <div>{chat.requester_user.id == store.user.id ? chat.seeker_user.username : chat.requester_user.username} for task {chat.task_id}</div>
                                {actions.isUserOnline(chat) && (
                                <span className="text-success ms-2">&#9679;</span>
                            )}
                            {(store.unseenMessages[chat.room_name] && chat != currentChat && !chatOpen) && <span className="badge bg-danger ms-2">New</span>}
                        </div>
                    )))}
                </div>
            </div>
        </div>
    );
}

export default PhoneChatList;