import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import StarRating from "../component/rating/StarRating.jsx";
import Map from "../component/geocoding/map.jsx";
import { Icon } from "@iconify/react/dist/iconify.js";

export const Task = () => {
	const { actions } = useContext(Context);
	const params = useParams();
	
	const [task, setTask] = useState({});
	const [requester, setRequester] = useState({});

	useEffect(() => {
		const loadInfo = async () => {
			const currentTask = await actions.getTask(params.theid);
			setTask(currentTask);
			console.log(typeof(currentTask.delivery_address.latitude))

			const requesterData = await actions.getRequester(currentTask.requester_id);
            setRequester(requesterData);
		}

		loadInfo();		
	}, [])

	return (
		<div className="container p-5 mx-auto">
			<div className="p-5">
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
							<p>{task.description}</p>
						</div>
						<div className="d-flex justify-content-between align-items-end">
							<div className="d-flex flex-column">
								<span><Icon className="fs-2" icon="mingcute:location-2-line" /><b>Pick Up: </b>{task.pickup_address?.address}</span>
								<span><Icon className="fs-2" icon="mingcute:location-2-fill" /><b>Drop Off: </b>{task.delivery_address?.address}</span>
							</div>
							<span><Icon className="fs-2 me-2" icon="fa6-solid:money-bill-1-wave" /><b>Budget: </b>{task.budget}</span>
						</div>
					</div>
				</div>
				<div className="row d-flex justify-content-center mt-4">
					<div className="col-6 me-3 d-flex flex-column justify-content-between">
						<div className="w-100 card">review1</div>
						<div className="w-100 card">review2</div>
						<div className="w-100 card">review3</div>
						<div className="w-100 d-flex justify-content-between">
							<button className="btn btn-dark px-4"><Icon icon="iconoir:bookmark" /></button>
							<button className="btn btn-dark px-4">Contact Requester</button>
						</div>
					</div>
					<div className="col-4 rounded overflow-hidden card p-0" style={{ height: "300px"}}>
						{ (task.delivery_address && task.pickup_address) && <Map markers={[[task.delivery_address?.latitude, task.delivery_address?.longitude], [task.pickup_address?.latitude, task.pickup_address?.longitude]]} height={300}></Map>}
					</div>
				</div>
			</div>
		</div>
	);
};

Task.propTypes = {
	match: PropTypes.object
};
