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
                <div className="d-flex align-items-center mb-2">
                    <div className="rounded-circle bg-dark me-2 overflow-hidden" style={{ height: "60px", width: "60px" }}>
                        { store.user.profile_picture && <img
                            className="img-fluid"
                            src={store.user.profile_picture}
                            alt="User Profile"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />}
                    </div>
                    <div className="d-flex flex-column justify-content-around">
                        <span className="fs-5">{store.user.full_name}</span>
                        <span className="fs-5">{store.user.username}</span>
                    </div>
                </div>
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
