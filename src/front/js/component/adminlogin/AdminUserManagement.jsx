import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../store/appContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminUserManagement = () => {
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const { store, actions } = useContext(Context);

    useEffect(() => {
        if (actions) {
            actions.getAdmins();
        } else {
            console.error("actions is not defined");
        }
    }, []); // Dependencias vacías para asegurarnos de que solo se ejecute una vez al montar el componente

    const handleAddAdmin = async () => {
        if (!newEmail || !newPassword) {
            alert("Please enter all required fields.");
            return;
        }
        actions.addAdmin(newEmail, newPassword);
        setNewEmail('');
        setNewPassword('');
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Add a New Admin</h2>
            <form className="form-inline">
                <div className="form-group mb-2">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                    />
                </div>
                <div className="form-group mx-sm-3 mb-2">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <button type="button" className="btn btn-primary mb-2" onClick={handleAddAdmin}>
                    Add Admin
                </button>
            </form>
            <ul className="list-group mt-4">
                {store.admins && store.admins.map(admin => (
                    <li key={admin.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <span>{`Email: ${admin.email}`}</span>
                        </div>
                        <div>
                            <button className="btn btn-danger btn-sm mr-2" onClick={() => actions.deleteAdmin(admin.id)}>
                                Delete
                            </button>
                            <button className="btn btn-success btn-sm" onClick={() => {
                                const newEmail = prompt("New email:", admin.email);
                                const newPassword = prompt("New password:", admin.password);
                                if (newEmail && newPassword) {
                                    actions.editAdmin(admin.id, newEmail, newPassword);
                                } else {
                                    alert("Please enter valid details.");
                                }
                            }}>
                                Edit
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminUserManagement;
