import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext.js";
import Seeker from "./seeker.jsx";

const SeekerList = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => actions.getSeekers(), []);

    return (
        <div className="container-fluid px-5">
            <div className="row">
                {store.seekers.map((user) => {
                    return (
                        <React.Fragment key={user.id}>
                            <Seeker seekerInfo={user}></Seeker>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}

export default SeekerList;