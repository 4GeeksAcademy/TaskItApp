import React, { useState, useContext } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.login(email, password);
        if (success) {
            navigate("/"); // Ajusta la ruta a la que deseas redirigir después del login
        }
    };

    return (
        <div className="d-flex flex-column align-items-center">
            <form className="w-50 mx-auto" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="loginEmail" className="form-label">Email address</label>
                    <input 
                        id="loginEmail"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        type="email" 
                        className="form-control" 
                        placeholder="Enter email"
                        required
                    />
                </div>
                <div className="mb3">
                    <label htmlFor="loginPassword" className="form-label">Password</label>
                    <input 
                        id="loginPassword"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        type="password" 
                        className="form-control mb-3" 
                        placeholder="Enter password"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success w-100">Login</button>
            </form>
        </div>
    );
};

export default Login;
