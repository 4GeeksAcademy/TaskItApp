import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

const UserSelect = () => {
    const { store, actions } = useContext(Context);
    const [selectedValue, setSelectedValue] = useState('');

    useEffect(() => {
        actions.getUsers();
    }, []);


    return (
        <div className="d-flex align-items-center justify-content-center">
            <div className="fw-bold pe-2">Choose user:</div>
            <select 
                className="form-select select-options" 
                aria-label="User list" 
                id="user-select"
                value={selectedValue}
                onChange={(e) => { actions.setUser(e.target.value); setSelectedValue(e.target.value); }}
            >
                <option value="" disabled>Choose category</option>
                {store.users.map((user) => (
                    <option key={user.id} value={user.username}>{user.username}</option>
                ))}
            </select>
        </div>
    );
};

export default UserSelect;