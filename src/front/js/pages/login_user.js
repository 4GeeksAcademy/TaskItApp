import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

const LoginUser = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    function sendData(e) {
        e.preventDefault();
        actions.login(username, password).then(() => {
            if (store.auth) {
                navigate("/");
            }
        });
    }

    useEffect(() => {
        if(store.auth) navigate('/')
    }, [store.auth])

    return (
        <div>
            <form className="w-50 mx-auto" onSubmit={sendData}>
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
                <button type="submit" className="btn btn-success w-100 mb-3">Sign In</button>
                <p>or</p>
                <Link to="/signup-user">
                    <button className="btn btn-primary">Sign Up</button>
                </Link>
            </form>
        </div>
    );
}

export default LoginUser;
