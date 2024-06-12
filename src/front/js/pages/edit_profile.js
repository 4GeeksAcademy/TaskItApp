import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import useScreenWidth from '../hooks/useScreenWidth.jsx';

const EditProfile = () => {
    const { store, actions } = useContext(Context);
    const [username, setUsername] = useState(store.user.username);
    const [email, setEmail] = useState(store.user.email);
    const [fullName, setFullName] = useState(store.user.full_name);
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(store.user.role);
    const [description, setDescription] = useState(store.user.description);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const isScreenWidthBelow760 = useScreenWidth();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await actions.editUser(store.user.id, username, email, password, fullName, description, role);
        if (file) {
            await actions.uploadProfilePicture(store.user.id, file);
        }
        navigate("/");
    };

    return (
        <div className={`container ${isScreenWidthBelow760 ? 'small-screen' : ''}`}>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="text-center mb-4">Edit Profile</h2>
                    {store.user.profile_picture && (
                        <div className="mb-3 text-center">
                            <img src={store.user.profile_picture} alt="Profile" className="img-thumbnail img-fluid" style={{ maxWidth: '100%', width: '50%' }} />
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

                        <div className="form-group mb-3 mb-3">
                            <label htmlFor="edit-description" className="form-label">Description:</label>
                            <textarea
                                className="form-control"
                                id="description"
                                name="edit-description"
                                placeholder="Tell us about yourself..."
                                value={description || ''}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="role" className="form-label">Select Your Role:</label>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="edit-requester"
                                    name="role"
                                    value="requester"
                                    checked={role === 'requester'}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                                <label className="form-check-label me-2" htmlFor="edit-requester">Requester</label>
                                <small className="form-text text-muted">You can request tasks.</small>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="edit-seeker"
                                    name="role"
                                    value="task_seeker"
                                    checked={role === 'task_seeker'}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                                <label className="form-check-label me-2" htmlFor="edit-seeker">Seeker</label>
                                <small className="form-text text-muted">You can look for tasks to complete.</small>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="edit-both"
                                    name="role"
                                    value="both"
                                    checked={role === 'both'}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                                <label className="form-check-label me-2" htmlFor="edit-both">Both</label>
                                <small className="form-text text-muted">You can both request and seek tasks.</small>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-green w-100">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
