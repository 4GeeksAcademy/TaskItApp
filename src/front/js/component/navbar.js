import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/navbar.css";
import { Icon } from "@iconify/react/dist/iconify.js";

export const Navbar = () => {
    const { store, actions } = useContext(Context);

    const handleLogout = () => {
        actions.logout();
    };

    return (
        <nav className="navbar navbar-light bg-white py-5 px-3">
            <div className="container-fluid">
                <div className="d-flex align-items-center">
                    {store.auth && <Icon className="smooth me-2 fs-2" icon="solar:hamburger-menu-linear" />}
                    <Link to="/">
                        <span className="navbar-brand mb-0 h1">Task It App</span>
                    </Link>
                </div>
                {!store.auth ? (
                    <div className="ml-auto d-flex me-2">
                        <ul className="nav">
                            <li className="nav-item">
                                <Link className="nav-link text-dark smooth" to="/about">
                                    About
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-dark smooth" to="/login-user">
                                    Sign In
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/signup-user">
                                    <button className="btn btn-dark smooth">Get Started</button>
                                </Link>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="ml-auto">
                        <ul className="nav d-flex align-items-center">
                            {(store.user.role === "both" || store.user.role === "requester") && (
                                <li className="nav-item">
                                    <Link to="/user-panel">
                                        <button className="btn btn-dark smooth">User Panel</button>
                                    </Link>
                                </li>
                            )}
                            <li className="nav-item d-flex align-items-center fs-2 mx-2">
                                <Icon className="smooth" icon="mdi:bell-outline" />
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-danger smooth" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};
