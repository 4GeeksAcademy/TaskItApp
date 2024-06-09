import React, { Component } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import "../../styles/custom-footer.css";

export const Footer = () => (
	<div>
		<hr></hr>
		<footer className="footer mt-auto py-3 text-center custom-footer">
			
			<div className="container">
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
						<li className="mt-3"><a href="https://github.com/BlondyMartinez" className="text-dark">Blondy Martínez Montero <Icon icon="mdi:github" className="fs-2 github-icon-1" /></a></li>
						<li className="mt-3"><a href="https://github.com/Fali1980" className="text-dark">Rafael Hilario Rodríguez <Icon icon="mdi:github" className="fs-2 github-icon-2" /></a></li>
						<li className="mt-3"><a href="https://github.com/Aresdgi" className="text-dark">Ares Dominguez Gil <Icon icon="mdi:github" className="fs-2 github-icon-3" /></a></li>
						</ul>
					</div>
				
				
					<div className="col-md-4 text-right">
						<ul className="list-unstyled">
						<li className="mt-2"><a href="#" className="text-dark">Terms of Service</a></li>
						<li className="mt-3"><a href="#" className="text-dark">Privacy Policy</a></li>
						<li className="mt-3"><a href="#" className="text-dark">FAQs</a></li>
						<li className="mt-3"><a href="#" className="text-dark">About Us</a></li>
						</ul>
					</div>
				</div>
			</div>
			
		</footer>
	</div>
);
