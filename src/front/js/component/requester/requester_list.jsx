import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext.js";
import Requester from "./requester.jsx";

const RequesterList = () => {
    const { store, actions } = useContext(Context);
    useEffect(() => actions.getRequesters(), []);

    return (
        <div>
            {store.requesters.map((user) => {
                return (
                    <React.Fragment key={user.id}>
                        <Requester userInfo={user}></Requester>
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export default RequesterList;