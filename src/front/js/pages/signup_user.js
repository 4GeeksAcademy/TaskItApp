import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link } from "react-router-dom";
import Alert from "../component/alert.jsx"

const SignupUser = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => { store.error = ''; store.message = '' }, [])

    async function sendData(e) {
        e.preventDefault();
        const newUser = await actions.addUser(email, password, username);
        if (newUser) navigate("/login");
    }

    useEffect(() => {
        if (store.auth) navigate('/')
    }, [store.auth, navigate]);

    return (
        <div className="d-flex justify-content-center align-items-center bg-light" style={{ width: '100vw', height: '100vh' }}>
            <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h4 className="text-center">Create an account</h4>
                <small className="text-center mb-3">Enter an email to sign up for this app</small>
                {(store.message || store.error) && <Alert message={store.message} error={store.error} ></Alert>}
                <form onSubmit={sendData}>
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
                    <button type="submit" className="btn btn-green w-100 mb-3">Sign Up</button>
                    <div className="text-center d-flex flex-column">
                        <small className="mb-2">By clicking continue, you agree to our <b>Terms of Service</b> and <b>Privacy Policy</b></small>
                        <span>Already have an account? <Link to="/login"><b>Sign In</b></Link></span>
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

export default SignupUser;
