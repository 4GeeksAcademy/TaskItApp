import React, { useEffect, useRef, useContext } from "react";
import "../../../styles/dropdown.css"; 
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
        navigate("/");
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
            { store.user?.role != "none" &&
                <>
                    <div className="dropdown-item d-flex" onClick={() => navigate(`/users/${store.user.username}`)}>
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <div className="rounded-circle bg-dark overflow-hidden col-2" style={{ height: "60px", width: "60px", aspectRatio: '1/1' }}>
                                { store.user.profile_picture && <img
                                    className="img-fluid"
                                    src={store.user.profile_picture}
                                    alt="User Profile"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />}
                            </div>
                            <div className="d-flex flex-column justify-content-around col-10">
                                <span className="fs-5 text-break">{store.user.full_name}</span>
                                <span className="fs-5 text-break">{store.user.username}</span>
                            </div>
                        </div>
                    </div>
                    <div className="dropdown-item fs-5" type="button" onClick={handleEditProfileClick}>
                        <span><Icon icon="mage:edit-fill" /> Edit profile</span>
                    </div>
                </>
            }   
            <div className="dropdown-item fs-5" type="button" onClick={handleLogout}>
                <span><Icon icon="icon-park:logout" /> Sign out </span>
            </div>
        </div>
    );
};

export default SettingsUser;
