import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext.js";
import Seeker from "./seeker.jsx";

const SeekerList = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => actions.getSeekers(), []);

    return (
        <div>
            {store.seekers.map((user) => {
                return (
                    <React.Fragment key={user.id}>
                        <Seeker userInfo={user}></Seeker>
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export default SeekerList;