import React, { useState, useContext } from 'react';
import { Context } from '../../store/appContext';

const ProfileSetup = () => {
    const { store, actions } = useContext(Context);

    const [fullName, setFullName] = useState('');
    const [description, setDescription] = useState('');
    const [role, setRole] = useState('');
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await actions.editUser(store.user.id, store.user.username, store.user.email, '', fullName, description, role);
        if (file) {
            await actions.uploadProfilePicture(store.user.id, file);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div className="container p-5 pt-0">
            <div className="row">
                <div className="col-md-8 mx-auto">
                    <div className="card">
                        <div className="card-header bg-darkblue text-green text-center">
                            <h2>Welcome to Task It App!</h2>
                            <p>Let's set up your profile</p>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="profile-picture" className="form-label">Profile Picture</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="profile-picture"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="full-name">Full Name:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="full-name"
                                        name="full-name" 
                                        maxLength="120"
                                        placeholder="Enter your full name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description">Description:</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        placeholder="Tell us about yourself..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="role">Select Your Role:</label>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="requester"
                                            name="role"
                                            value="requester"
                                            checked={role === 'requester'}
                                            onChange={(e) => setRole(e.target.value)}
                                            required
                                        />
                                        <label className="form-check-label me-2" htmlFor="requester">
                                            Requester
                                        </label>
                                        <small className="form-text text-muted">You can request tasks.</small>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="seeker"
                                            name="role"
                                            value="task_seeker"
                                            checked={role === 'task_seeker'}
                                            onChange={(e) => setRole(e.target.value)}
                                            required
                                        />
                                        <label className="form-check-label me-2" htmlFor="seeker">
                                            Seeker
                                        </label>
                                        <small className="form-text text-muted">You can look for tasks to complete.</small>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="both"
                                            name="role"
                                            value="both"
                                            checked={role === 'both'}
                                            onChange={(e) => setRole(e.target.value)}
                                            required
                                        />
                                        <label className="form-check-label me-2" htmlFor="both">
                                            Both
                                        </label>
                                        <small className="form-text text-muted">You can both request and seek tasks.</small>
                                    </div>
                                </div>

                                <div className="form-group text-center">
                                    <button type="submit" className="btn btn-green smooth">Save Profile</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSetup;