import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import StarRating from "../component/rating/StarRating.jsx";
import Map from "../component/geocoding/map.jsx";
import { Icon } from "@iconify/react/dist/iconify.js";
import TaskForm from "../component/task/task_form.jsx";
import ApplicantForm from "../component/applicant/applicant_form.jsx"

export const Task = () => {
	const { store, actions } = useContext(Context);
	const params = useParams();
	
	const [task, setTask] = useState({});
	const [requester, setRequester] = useState({});
	const [showTaskForm, setShowTaskForm] = useState(false);
	const [showApplicationForm, setShowApplicationForm] = useState(false);
	const [applied, setApplied] = useState(false);

    const handleCloseTaskForm = () => setShowTaskForm(false);
    const handleShowTaskForm = () => setShowTaskForm(true);
	const handleCloseApplicationForm = () => setShowApplicationForm(false);
    const handleShowApplicationForm = () => setShowApplicationForm(true);

	const loadInfo = async () => {
		const currentTask = await actions.getTask(params.theid);
		setTask(currentTask);

		const requesterData = await actions.getRequester(currentTask.requester_id);
		setRequester(requesterData);
		
		alreadyApplied(currentTask);	
	}

	useEffect(() => {
		loadInfo();	
	}, [])

	const alreadyApplied = (currentTask) => {
		for(let applicant of currentTask.applicants) {
			if(applicant.seeker.id == store.user.seeker?.id) setApplied(true);
		}
	}

	const dueIn = (isoTime) => {
		const now = new Date();
		const time = new Date(isoTime);
		const diff = time - now; 
	
		const seconds = Math.floor(diff / 1000);
	
		const intervals = {
			day: 86400,
			hour: 3600,
			minute: 60
		};
	
		for (const [unit, secondsInterval] of Object.entries(intervals)) {
			const intervalCount = Math.floor(seconds / secondsInterval);
			if (intervalCount >= 1) {
				if (unit === 'day') return `in ${intervalCount} day${intervalCount === 1 ? '' : 's'} and ${Math.floor((seconds % secondsInterval) / 3600)} hours`;
				else if (unit === 'hour') return `in ${intervalCount} hour${intervalCount === 1 ? '' : 's'} and ${Math.floor((seconds % secondsInterval) / 60)} minutes`;
				else return `in ${intervalCount} minute${intervalCount === 1 ? '' : 's'}`;
			}
		}
	
		return 'Just now';
	}

	return (
		<div className="container p-5 pt-0 mx-auto">
			<div className="p-5 pt-0">
				<div className="row d-flex justify-content-center">
					<div className="col-2">
						<div className="rounded bg-dark overflow-hidden" style={{ width: "100%", aspectRatio: "1/1" }}></div>
						<Link to={`/users/${task.requester_user?.username}`}>
							<h5 className="mb-0 pt-2" >{task.requester_user?.username || "username"}</h5>
						</Link>
						<div className="d-flex align-items-center">
							<StarRating value={requester.overall_rating}></StarRating>
							<span className="text-muted ms-1">({requester.total_reviews})</span>
						</div>
					</div>
					<div className="col-8 d-flex flex-column justify-content-between">
						<div>
							<h1>{task.title}</h1>
							<p className="text-muted">{actions.timeAgo(task.creation_date)}</p>
							<p>{task.description}</p>
						</div>
						<div>
							<div className="d-flex flex-column">
								<span><Icon className="fs-3" icon="mingcute:location-2-line" /><b>Pick Up: </b>{task.pickup_address?.address}</span>
								<span><Icon className="fs-3" icon="mingcute:location-2-fill" /><b>Drop Off: </b>{task.delivery_address?.address}</span>
							</div>
							<div className="d-flex justify-content-between align-items-end">
								<span><Icon className="fs-4 me-2" icon="fa6-solid:money-bill-1-wave" /><b>Budget: </b>{task.budget}€</span>
								<span><Icon className="fs-3 me-2" icon="solar:calendar-linear" /><b>Due: </b>{dueIn(task.due_date)}</span>
							</div>
						</div>
					</div>
				</div>
				<div className="row d-flex justify-content-center mt-4">
					<div className="col-6 me-3 d-flex flex-column justify-content-between">
						<div className="w-100 card">review1</div>
						<div className="w-100 card">review2</div>
						<div className="w-100 card">review3</div>
						{store.user.id != task.requester_user?.id 
							?<div className="w-100 d-flex justify-content-between">
								{ ((store.user.role == "both" || store.user.role == "task_seeker") && !applied) && <button className="btn btn-dark px-4" onClick={handleShowApplicationForm}>Apply</button>}
								<button className="btn btn-dark px-4">Contact Requester</button>
							</div>
							:<div className="w-100 d-flex justify-content-between">
								<button className="btn btn-dark px-4" onClick={handleShowTaskForm}><Icon icon="mage:edit-fill" /> Edit</button>
							</div>
						}
					</div>
					<div className="col-4 rounded overflow-hidden card p-0" style={{ height: "300px"}}>
						{ (task.delivery_address && task.pickup_address) && <Map markers={[[task.delivery_address?.latitude, task.delivery_address?.longitude], [task.pickup_address?.latitude, task.pickup_address?.longitude]]} height={300}></Map>}
					</div>
				</div>
			</div>

			<TaskForm show={showTaskForm} handleClose={handleCloseTaskForm} currentTask={task} loadInfo={loadInfo} ></TaskForm>
			<ApplicantForm show={showApplicationForm} handleClose={handleCloseApplicationForm} taskID={task.id} setApplied={setApplied} ></ApplicantForm>
		</div>
	);
};

Task.propTypes = {
	match: PropTypes.object
};
