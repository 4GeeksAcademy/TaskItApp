import React, { useEffect, useRef, useContext } from "react";
import "../../../styles/accordion.css"; 
import { Icon } from "@iconify/react/dist/iconify.js";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";

const SettingsUser = ({ dropdownVisible, setDropdownVisible }) => {
    const ref = useRef(null);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setDropdownVisible(false);
        }
    };

    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const handleLogout = () => {
        actions.logout();
        navigate("/login-user");
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleEditProfileClick = () => {
        navigate("/edit-profile");
    };

    return (
        <div ref={ref} className={`dropdown-menu ${dropdownVisible ? 'show' : ''}`} aria-labelledby="dropdownMenuButton">
            <div className="dropdown-item">
                <strong>Profile</strong>
                <img
                    className="img-fluid img-circle"
                    src="https://www.phillymag.com/wp-content/uploads/sites/3/2019/03/best-career-advice-900x600.jpg"
                    alt="User Profile"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <ul>
                    <li>Username: {store.user.username}</li>
                    <li>Email: {store.user.email}</li>
                    <li>Full Name: {store.user.full_name}</li>
                </ul>
            </div>
            <div className="dropdown-item" type="button" onClick={handleEditProfileClick}>
                <strong>Edit profile <Icon icon="mage:edit-fill" /></strong>
            </div>
            <div className="dropdown-item" type="button" onClick={handleLogout}>
                <strong>Sign out <Icon icon="icon-park:logout" /></strong>
            </div>
        </div>
    );
};

export default SettingsUser;
