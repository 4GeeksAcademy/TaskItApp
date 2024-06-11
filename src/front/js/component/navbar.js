import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link, useLocation } from "react-router-dom";
import "../../styles/navbar.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import TaskForm from './task/task_form.jsx';
import Notification from "./notification/notification_badge.js";
import NotificationDropdown from "./notification/notification_dropdown.jsx";
import SettingsUser from './user/user_settings.js';

export const Navbar = () => {
    const { store } = useContext(Context);
    const [show, setShow] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [notificationsVisible, setNotificationsVisible] = useState(false);

    const path = useLocation().pathname;

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const toggleDropdown = () => setDropdownVisible(!dropdownVisible);
    const toggleNotificationsDropdown = () => {
        if (store.notifications.length > 0) setNotificationsVisible(!notificationsVisible);
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            { (path != "/signup" && path != "/login") &&
                <nav className="navbar navbar-expand-lg navbar-light bg-white py-5 px-3 sticky-top">
                    <div className="container-fluid">
                        <Link to="/" className="navbar-brand">
                            <span className="navbar-brand mb-0 h1">Task It App</span>
                        </Link>
                        {!store.auth ? (
                            <>
                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarNav">
                                    <ul className="navbar-nav ms-auto">
                                        <li className="nav-item">
                                            <Link className="nav-link text-dark smooth" to="/#features" onClick={() => scrollToSection('features')}>
                                                Features
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link text-dark smooth" to="/#how-it-works" onClick={() => scrollToSection('how-it-works')}>
                                                How it Works
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link text-dark smooth" to="/about">
                                                About
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link text-dark smooth" to="/login">
                                                Sign In
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/signup">
                                                <button className="btn btn-green smooth">Get Started</button>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <div className="ml-auto d-flex align-items-center">
                                <ul className="nav">
                                    {(store.user.role === "both" || store.user.role === "requester") && (
                                        <li className="nav-item">
                                            <button className="btn btn-dark smooth" onClick={handleShow}>Post Task</button>
                                        </li>
                                    )}
                                    <li className="nav-item d-flex align-items-center fs-2 mx-2 position-relative">
                                        <Icon className="smooth" icon="mdi:bell-outline" onClick={toggleNotificationsDropdown} />
                                        <Notification className="smooth" />
                                        <NotificationDropdown dropdownVisible={notificationsVisible} setDropdownVisible={setNotificationsVisible} />
                                    </li>
                                    <li className="position-relative">
                                        <div
                                            className="bg-black rounded-circle smooth overflow-hidden"
                                            style={{ width: "3rem", height: "3rem" }}
                                            onClick={toggleDropdown}
                                        >
                                            {store.user.profile_picture && (
                                                <img
                                                    className="img-fluid"
                                                    src={store.user.profile_picture}
                                                    alt="User Profile"
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                            )}
                                        </div>
                                        <SettingsUser dropdownVisible={dropdownVisible} setDropdownVisible={setDropdownVisible} />
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <TaskForm show={show} handleClose={handleClose} />
                </nav>
            }
        </>
    );
};
