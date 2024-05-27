import React, { useContext, useState } from "react";
import { Context } from "../../store/appContext";
import UserForm from "./user_form.jsx";
import { Link } from "react-router-dom";

const User = ({ userInfo }) => {
    const { actions } = useContext(Context);

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        actions.setEditing(false);
    }
    const handleShow = () => {
        setShow(true);
        actions.setEditing(true);
    }

    return (
        <div className="container">
            <div className="card mb-2">
                <h2>{userInfo.username}</h2>
                <p>{userInfo.full_name}</p>
                <p>{userInfo.email}</p>
                {show && <UserForm currentUser={userInfo} handleClose={handleClose}></UserForm>}
                <button className="btn btn-primary" onClick={handleShow}>Edit</button>
                <button className="btn btn-danger" onClick={() => actions.deleteUser(userInfo.id)}>Delete</button>
                <Link to={`/users/${userInfo.username}`}>View</Link>
            </div>
        </div>
    );
}

export default User;