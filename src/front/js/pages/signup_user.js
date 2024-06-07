import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link } from "react-router-dom";
import Alert from "../component/alert.jsx"

const SignupUser = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    async function sendData(e) {
        e.preventDefault();
        const newUser = await actions.addUser(email, password, username);
        if(newUser) navigate("/login-user");
    }

    useEffect(() => {
        if(store.auth) navigate('/')
    }, [store.auth])

    return (
        <div className="d-flex flex-column align-items-center">
            {(store.message || store.error) && <Alert message={store.message} error={store.error} ></Alert>}
            <form className="w-50 mx-auto" onSubmit={sendData}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail" className="form-label">Email address</label>
                    <input 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        type="email" 
                        className="form-control" 
                        id="exampleInputEmail" 
                        placeholder="Enter email"
                        required
                    />
                </div>
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
                <button type="submit" className="btn btn-success w-100">Sign Up</button>
            </form>
            <br />
            <Link to="/">
                <button className="btn btn-primary mt-3">Back to Home</button>
            </Link>
        </div>
    );
}

export default SignupUser;
