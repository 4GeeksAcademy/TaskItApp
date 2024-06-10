import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

const LoginUser = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (store.auth) navigate('/');
    }, [store.auth, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await actions.login(username, password);
        if (store.auth) navigate('/');
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
            <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="exampleInputUsername" className="form-label">Username</label>
                        <input 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            type="text" 
                            className="form-control" 
                            id="exampleInputUsername" 
                            placeholder="Enter username"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword" className="form-label">Password</label>
                        <input 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            type="password" 
                            className="form-control mb-3" 
                            id="exampleInputPassword" 
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-dark w-100 mb-3">Sign In</button>
                    <div className="text-center">
                        <span>Need an account? <Link to="/signup-user">Sign up</Link></span>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginUser;
