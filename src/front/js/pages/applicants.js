import React, { useEffect, useState, useContext } from "react";
import Seeker from "../component/seeker/seeker.jsx";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";

export const Applicants = () => {
    const { actions } = useContext(Context);
	const params = useParams();

	const [task, setTask] = useState({});

	useEffect(() => {
		const loadInfo = async () => {
			const currentTask = await actions.getTask(params.theid);
			setTask(currentTask);
		}

		loadInfo();		
	}, [])

	return (
		<div className="d-flex justify-content-center">
			{task.applicants?.map((applicant) => {
                return <Seeker key={applicant.id} seekerInfo={applicant.seeker} applicantInfo={applicant} ></Seeker>
            })}
		</div>
	);
};
