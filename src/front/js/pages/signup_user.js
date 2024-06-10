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
        if (newUser) navigate("/login-user");
    }

    useEffect(() => {
        if (store.auth) navigate('/')
    }, [store.auth, navigate]);

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
            <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
                {(store.message || store.error) && <Alert message={store.message} error={store.error} ></Alert>}
                <form onSubmit={sendData}>
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
                    <button type="submit" className="btn btn-dark w-100 mb-3">Sign Up</button>
                    <div className="text-center">
                        <span>ALREADY HAVE AN ACCOUNT? <Link to="/login-user">LOG IN</Link></span>
                    </div>
                    <div className="text-center mt-3">
                        <Link to="/">
                            <span className="btn btn-link">Back to Home</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignupUser;
