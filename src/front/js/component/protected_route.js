import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../store/appContext";

const ProtectedRoute = ({ element }) => {
    const { store } = useContext(Context);

    if (!store.auth) {
        return <Navigate to="/login" />;
    }

    return element;
};

export default ProtectedRoute;
