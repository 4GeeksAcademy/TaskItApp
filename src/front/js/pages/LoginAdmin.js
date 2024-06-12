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
        <div className="d-flex justify-content-center align-items-center" style={{ width: '100vw', height: '100vh'}}>
            <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h4 className="text-center">Log in as Admin</h4>
                <form onSubmit={handleLogin}>
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
                    <button type="submit" className="btn btn-green w-100 mb-3">Log In</button>
                </form>
                <div className="text-center">
                    <span>Not an admin? <Link to="/signin"><b>Sing In</b></Link></span>
                </div>
                <div className="text-center mt-3">
                    <Link to="/">
                        <span className="btn btn-clear-green fw-normal">Back to Home</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LoginAdmin;
