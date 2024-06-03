import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Link } from "react-router-dom";
import UserTaskList from "../component/task/user_tasks_list.jsx";

export const Home = () => {
	const { store } = useContext(Context);

	return (
		<div>
			{ store.auth 
				? <UserTaskList></UserTaskList>
				: <div className="text-center mt-5">
					<Link className="px-5" to="/users">users</Link>
					<Link className="px-5" to="/tasks">tasks</Link>
					<Link className="px-5" to="/categories">categories</Link>
					<Link className="px-5" to="/addresses">addresses</Link>
					<Link className="px-5" to="/requesters">requesters</Link>
					<Link className="px-5" to="/seekers">seekers</Link>
					<Link className="px-5" to="/postulants">postulants</Link>
					<Link className="px-5" to="/ratings">ratings</Link>
				</div>
			}
		</div>
	);
};
