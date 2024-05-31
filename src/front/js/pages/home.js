import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { Link } from "react-router-dom";
import UserSelect from "../component/user_list_select.jsx";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5">
			<UserSelect></UserSelect>
			<Link className="px-5" to="/users">users</Link>
			<Link className="px-5" to="/tasks">tasks</Link>
			<Link className="px-5" to="/categories">categories</Link>
			<Link className="px-5" to="/addresses">addresses</Link>
			<Link className="px-5" to="/requesters">requesters</Link>
			<Link className="px-5" to="/seekers">seekers</Link>
			<Link className="px-5" to="/postulants">postulants</Link>
			<Link className="px-5" to="/ratings">ratings</Link>
			
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
