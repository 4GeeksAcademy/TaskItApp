import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import User from "./user.jsx";

const UserList = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => actions.getUsers(), []);

    return (
        <div>
            {store.users.map((user) => {
                return (
                    <React.Fragment key={user.id}>
                        <User userInfo={user}></User>
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export default UserList;