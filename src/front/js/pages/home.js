import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { Link } from "react-router-dom";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5">
			<button className="btn btn-primary" onClick={() => actions.setAuth(!store.auth)}>Auth</button>
			<Link className="px-5" to="/users">Users</Link>
			<Link className="px-5" to="/categories">categories</Link>
			<Link className="px-5" to="/addresses">addresses</Link>
			<Link className="px-5" to="/requesters">requesters</Link>
			<Link className="px-5" to="/seekers">seekers</Link>
			<h1>Hello Rigo!!</h1>
			<p>
				<img src={rigoImageUrl} />
			</p>
			<div className="alert alert-info">
				{store.message || "Loading message from the backend (make sure your python backend is running)..."}
			</div>
		</div>
	);
};
