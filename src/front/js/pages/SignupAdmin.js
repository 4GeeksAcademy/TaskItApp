import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link } from "react-router-dom";

const LoginAdmin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    function handleLogin(e) {
        e.preventDefault();
        actions.loginAdmin(email, password).then(() => {
            navigate("/categories"); // Redirigir a un dashboard de administrador, por ejemplo
        });
    }

    return (
        <div className="d-flex flex-column align-items-center">
            <form className="w-50 mx-auto" onSubmit={handleLogin}>
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
                <button type="submit" className="btn btn-success w-100">Login</button>
            </form>
            <br />
            <Link to="/">
                <button className="btn btn-primary mt-3">Back to Home</button>
            </Link>
        </div>
    );
}

export default LoginAdmin;
