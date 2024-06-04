import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
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

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const toggleDropdown = () => setDropdownVisible(!dropdownVisible); 
    const toggleNotificationsDropdown = () => { if(store.notifications.length > 0) setNotificationsVisible(!notificationsVisible); }

    return (
        <nav className="navbar navbar-light bg-white py-5 px-3">
			<div className="container-fluid">
				<div className="d-flex align-items-center">
					<Link to="/">
						<span className="navbar-brand mb-0 h1">Task It App</span>
					</Link>
				</div>
				{ !store.auth
				? <div className="ml-auto d-flex me-2">
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
				: <div className="ml-auto">
					<ul className="nav d-flex align-items-center">
						{ (store.user.role == "both" || store.user.role == "requester") &&
							<li className="nav-item">
								<button className="btn btn-dark smooth" onClick={handleShow}>Post Task</button>	
							</li>
						}
						    <li className="nav-item d-flex align-items-center fs-2 mx-2 position-relative">
                                <Icon className="smooth" icon="mdi:bell-outline"  onClick={toggleNotificationsDropdown} />
								<Notification className="smooth"></Notification>
								<NotificationDropdown  dropdownVisible={notificationsVisible} setDropdownVisible={setNotificationsVisible} ></NotificationDropdown>
                            </li>
                            <li className="position-relative">
                                <div
                                    className="bg-black rounded-circle smooth overflow-hidden"
                                    style={{ width: "3rem", height: "3rem" }}
                                    onClick={toggleDropdown}
                                >
                                    <img
                                        className="img-fluid"
                                        src="https://www.phillymag.com/wp-content/uploads/sites/3/2019/03/best-career-advice-900x600.jpg"
                                        alt="User Profile"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </div>
                                <SettingsUser dropdownVisible={dropdownVisible} setDropdownVisible={setDropdownVisible} />
                            </li>
					</ul>
				</div>
				}
			</div>

			<TaskForm show={show} handleClose={handleClose}></TaskForm>
		</nav>
    );
};

