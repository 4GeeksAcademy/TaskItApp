import React, { useContext, useState } from "react";
import { Context } from "../../store/appContext.js";
import RequesterForm from "./requester_form.jsx";

const User = ({ userInfo }) => {
    const { actions } = useContext(Context);

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => {
        setShow(true);
    }

    return (
        <div className="container">
            <div className="card mb-2">
                <h2>{userInfo.username}</h2>
                <p>{userInfo.overall_rating}</p>
                <p>{userInfo.total_reviews}</p>
                <p>{userInfo.total_requested_tasks}</p>
                <p>{userInfo.average_budget}</p>
                {show && <RequesterForm currentRequester={userInfo} handleClose={handleClose}></RequesterForm>}
                <button className="btn btn-primary" onClick={handleShow}>Edit</button>
                <button className="btn btn-danger" onClick={() => actions.deleteRequester(userInfo.id)}>Delete</button>
            </div>
        </div>
    );
}

export default User;