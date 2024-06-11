import React, { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../store/appContext";

const ProtectedRoute = ({ element, roles }) => {
    const { store, actions } = useContext(Context);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAuthorization = async () => {
            const tokenValid = await actions.validateToken();
            if (tokenValid) {
                if (!roles || roles.includes(store.user?.role)) {
                    setIsAuthorized(true);
                }
            }
            setIsLoading(false);
        };
        checkAuthorization();
    }, [actions, store.user?.role, roles]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthorized) {
        return <Navigate to="/login" />;
    }

    return element;
};

export default ProtectedRoute;
