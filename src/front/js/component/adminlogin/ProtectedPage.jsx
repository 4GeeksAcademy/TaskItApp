import React, { useContext, useEffect } from 'react';
import { Context } from '../../store/appContext';
import { useNavigate, Link } from 'react-router-dom';

const ProtectedPage = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        if (store.auth) {
            actions.getProtectedData();
        }
    }, [store.auth, actions]);

    return (
        <div className="d-flex flex-column align-items-center">
            {store.auth ? (
                <div>
                    <h1>Hola, estás registrado</h1>
                    <iframe
                        src="https://tenor.com/embed/7112874144803734361"
                        width="100%"
                        height="500"
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                </div>
            ) : (
                <div className="text-center">
                    <h1>No tienes autorización para estar aquí</h1>
                    <Link to="/login">
                        <button className="btn btn-success mt-3">Login</button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ProtectedPage;
