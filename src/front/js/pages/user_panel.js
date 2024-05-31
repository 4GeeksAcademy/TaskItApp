import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const UserPanel = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const handleLogout = () => {
        actions.logout();
        navigate("/login-user");
    };

    return (
        <div className="container mt-5">
            <h1>Este es el panel de usuario</h1>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default UserPanel;
