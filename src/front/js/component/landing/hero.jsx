import React from "react";
import "../../../styles/home.css"
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="mx-auto col-10 hero rounded overflow-hidden d-flex align-items-center">
                    <div className="mt-6 col-10 mx-auto d-flex flex-column align-items-center justify-content-center text-center">
                        <h1 className="fs-0 text-white">Task It App</h1>
                        <p className="fs-text text-white">Your All-in-One Errand Solution. Connect with ease: Whether you're seeking help or offering services, our platform streamlines the process. Choose from 10 categories, set rates, and find tasks or helpers effortlessly. Simplify your life today with Task It App.</p>
                        <Link to="/signup">
							<button className="btn-clear-yellow fs-5 px-5 py-1">Sign Up</button>
						</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero;