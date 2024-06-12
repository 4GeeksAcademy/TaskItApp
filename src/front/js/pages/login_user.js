import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../component/alert.jsx";

const LoginUser = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => { store.error = ''; store.message = '' }, [])

    useEffect(() => {
        if (store.auth) navigate('/');
    }, [store.auth, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await actions.login(username, password);
        if (store.auth) navigate('/');
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-light" style={{ width: '100vw', height: '100vh' }}>
            <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h4 className="text-center">Log in</h4>
                { (store.error || store.message) && <Alert message={store.message} error={store.error} ></Alert>}
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
                    <div className="mb-3 position-relative">
                        <label htmlFor="exampleInputPassword" className="form-label">Password</label>
                        <input 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            type={showPassword ? "text" : "password"}
                            className="form-control mb-3" 
                            id="exampleInputPassword" 
                            placeholder="Enter password"
                            required
                        />
                        <span 
                            className="position-absolute top-50 end-0" 
                            style={{ cursor: 'pointer', zIndex: '1', marginRight: '10px', marginTop: '0.25rem' }} 
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <i className="fa fa-eye"></i> : <i className="fa fa-eye-slash"></i>}
                        </span>
                    </div>
                    <button type="submit" className="btn btn-green w-100 mb-3">Sign In</button>
                    <div className="text-center">
                        <span>Need an account? <Link to="/signup"><b>Sing Up</b></Link></span>
                    </div>
                    <div className="text-center mt-3">
                        <Link to="/">
                            <span className="btn btn-clear-green fw-normal">Back to Home</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginUser;
