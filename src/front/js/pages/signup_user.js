import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link } from "react-router-dom";

const SignupUser = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [description, setDescription] = useState('');
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    function sendData(e) {
        e.preventDefault();
        actions.signup(email, password, username, fullName, description).then(() => {
            navigate("/login-user");
        });
    }

    return (
        <div className="d-flex flex-column align-items-center">
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
                    <label htmlFor="exampleInputFullName" className="form-label">Full Name</label>
                    <input 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)} 
                        type="text" 
                        className="form-control" 
                        id="exampleInputFullName" 
                        placeholder="Enter full name"
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
                <div className="mb-3">
                    <label htmlFor="exampleInputDescription" className="form-label">Description</label>
                    <input 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        type="text" 
                        className="form-control" 
                        id="exampleInputDescription" 
                        placeholder="Description"
                    />
                </div>
                <button type="submit" className="btn btn-success w-100">Signup</button>
            </form>
            <br />
            <Link to="/">
                <button className="btn btn-primary mt-3">Back to Home</button>
            </Link>
        </div>
    );
}

export default SignupUser;
