import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
    const { store, actions } = useContext(Context);
    const [username, setUsername] = useState(store.user.username);
    const [email, setEmail] = useState(store.user.email);
    const [fullName, setFullName] = useState(store.user.full_name);
    const [password, setPassword] = useState('');
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await actions.editUser(store.user.id, username, email, password, fullName);
        if (file) {
            await actions.uploadProfilePicture(store.user.id, file);
        }
        navigate("/user-panel");
    };

    return (
        <div className="container mt-5">
            <h2>Edit Profile</h2>
            {store.user.profile_picture && (
                <div className="mb-3">
                    <img src={store.user.profile_picture} alt="Profile" className="img-thumbnail" />
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">Full Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave blank to keep current password"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="profilePicture" className="form-label">Profile Picture</label>
                    <input
                        type="file"
                        className="form-control"
                        id="profilePicture"
                        onChange={handleFileChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
        </div>
    );
};

export default EditProfile;
