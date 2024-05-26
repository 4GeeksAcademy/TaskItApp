import React, { useContext, useState } from "react";
import { Context } from "../../store/appContext.js";
import SeekerForm from "./seeker_form.jsx";

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
                <p>{userInfo.total_completed_tasks}</p>
                {show && <SeekerForm currentSeeker={userInfo} handleClose={handleClose}></SeekerForm>}
                <button className="btn btn-primary" onClick={handleShow}>Edit</button>
                <button className="btn btn-danger" onClick={() => actions.deleteSeeker(userInfo.id)}>Delete</button>
            </div>
        </div>
    );
}

export default User;