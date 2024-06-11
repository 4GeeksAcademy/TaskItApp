import React, { useContext } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import "../../styles/custom-footer.css";
import { useLocation } from "react-router-dom";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Footer = () => {
    const path = useLocation().pathname;
	const { store } = useContext(Context);

	return ( 
		<>
			{ (path != "/signup" && path != "/login") &&
				<div className={ store.auth ? "pt-5 bg-light" : "mt-5"}>
					<footer className="footer footer-bg mt-auto py-3 text-center custom-footer text-white py-5">
						
						<div className="container py-5">
							<div className="row">
							
								<div className="col-md-4">
									<h2>TASK IT APP</h2>
									<div className="mt-5">
									<a href="#" className="text-secondary fs-2 mr-2"><Icon icon="ic:baseline-facebook" /></a>
									<a href="#" className="text-secondary fs-2 mr-2"><Icon icon="mdi:linkedin" /></a>
									<a href="#" className="text-secondary fs-2 mr-2"><Icon icon="mdi:youtube" /></a>
									<a href="#" className="text-secondary fs-2"><Icon icon="mdi:instagram" /></a>
									</div>
									<p className="mt-3">Copyright © 2024 Task It App. All rights reserved.</p>
								</div>
							
							
								<div className="col-md-4 text-center">
									<h5>Contact Us:</h5>
									
									<ul className="list-unstyled">
									<li className="mt-3"><a href="https://github.com/BlondyMartinez" className="text-light">Blondy Martínez Montero <Icon icon="mdi:github" className="fs-2 text-orange" /></a></li>
									<li className="mt-3"><a href="https://github.com/Fali1980" className="text-light">Rafael Hilario Rodríguez <Icon icon="mdi:github" className="fs-2 text-yellow" /></a></li>
									<li className="mt-3"><a href="https://github.com/Aresdgi" className="text-light">Ares Dominguez Gil <Icon icon="mdi:github" className="fs-2 text-green" /></a></li>
									</ul>
								</div>
							
							
								<div className="col-md-4 text-right">
									<ul className="list-unstyled">
										<li className="mt-2"><a href="#" className="text-light">Terms of Service</a></li>
										<li className="mt-3"><a href="#" className="text-light">Privacy Policy</a></li>
										<li className="mt-3"><a href="#" className="text-light">FAQs</a></li>
										<li className="mt-3"><a href="#" className="text-light">About Us</a></li>
									</ul>
								</div>
							</div>
						{ !store.auth &&
							<>
								<hr></hr>
								<div className="d-flex">
									<h3 className="text-yellow me-4">Are you an admin?</h3>
									<Link className="btn btn-clear-yellow px-3" to="/login-admin"><b>Log In</b></Link>
								</div>
							</>
						}
					</div>
				</footer>
			</div>}
		</>
	)
};
