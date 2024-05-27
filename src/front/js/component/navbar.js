import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/navbar.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import TaskForm from './task/task_form.jsx';

export const Navbar = () => {
	const { store } = useContext(Context);

	const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

	return (
		<nav className="navbar navbar-light bg-white py-5 px-3">
			<div className="container-fluid">
				<div className="d-flex align-items-center">

					{ store.auth && <Icon className="smooth me-2 fs-2" icon="solar:hamburger-menu-linear" />}
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
							<Link className="nav-link text-dark smooth" to="/sign-in">
								Sign In
							</Link>
						</li>
						<li className="nav-item">
							<Link to="/sign-up">
								<button className="btn btn-dark smooth">Get Started</button>
							</Link>
						</li>
					</ul>
				</div>
				: <div className="ml-auto">
					<ul className="nav d-flex align-items-center">
						{ store.user[0].role == "both" || store.user[0].role == "requester" &&
							<li className="nav-item">
								<button className="btn btn-dark smooth" onClick={handleShow}>Post Task</button>	
							</li>
						}
						<li className="nav-item d-flex align-items-center fs-2 mx-2">
							<Icon className="smooth" icon="mdi:bell-outline" />
						</li>
						<li>
							<div className="bg-black rounded-circle smooth overflow-hidden" style={{ width: "3rem", height: "3rem" }}>
								<img 
									className="img-fluid" 
									src="https://www.phillymag.com/wp-content/uploads/sites/3/2019/03/best-career-advice-900x600.jpg" 
									alt="User Profile"
									style={{ width: "100%", height: "100%", objectFit: "cover" }}
								/>
							</div>
						</li>
					</ul>
				</div>
				}
			</div>

			<TaskForm show={show} handleClose={handleClose}></TaskForm>
		</nav>
	);
};
