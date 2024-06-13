import React, { useEffect, useState, useContext } from "react";
import Seeker from "../component/seeker/seeker.jsx";
import { Context } from "../store/appContext";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../component/back_button.js";

export const Applicants = () => {
    const { store, actions } = useContext(Context);
	const params = useParams();
	const navigate = useNavigate();

	const [task, setTask] = useState({});

	useEffect(() => {
		const loadInfo = async () => {
			const currentTask = await actions.getTask(params.theid);
			setTask(currentTask);
			if(currentTask.requester_user.id != store.user.id || !store.auth) navigate('/');
		}

		loadInfo();		
	}, [])

	return (
		<div className="row d-flex justify-content-center px-5">
			<BackButton></BackButton>
			{ task.applicants?.length == 0 
				? <div className="text-center"><h3>No applicants yet.</h3></div>
				:  task.applicants?.map((applicant) => {
					return <Seeker key={applicant.id + "app"} seekerInfo={applicant.seeker} applicantInfo={applicant} applicants={task.applicants}></Seeker>
				})
			}
		</div>
	);
};
