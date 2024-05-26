import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";

export const User = () => {
	const { actions } = useContext(Context);
	const params = useParams();

	const [user, setUser] = useState({});
	const [seekerInfo, setSeekerInfo] = useState({});
	const [requesterInfo, setRequesterInfo] = useState({});

	useEffect(() => {
		const loadInfo = async () => {
			const currentUser = await actions.getUserByUsername(params.theusername);
			setUser(currentUser);
			console.log(currentUser)
			
			if(currentUser.role == "both"|| currentUser.role == "task_seeker") setSeekerInfo(await actions.getSeeker(currentUser.id));
			if(currentUser.role == "both"|| currentUser.role == "requester") setRequesterInfo(await actions.getRequester(currentUser.id));
		}

		loadInfo();
	}, [])

	return (
		<div className="container-fluid">
			<div className="row d-flex justify-content-center mx-2">
				<div className="col-6" >
					<div className="rounded overflow-hidden p-0 float-start">
						<img 
							className="img-fluid" 
							src="https://www.phillymag.com/wp-content/uploads/sites/3/2019/03/best-career-advice-900x600.jpg" 
							alt="User Profile"
							style={{ height: "40rem", objectFit: "cover" }}
						/>
					</div>
				</div>
				<div className="col-6 d-flex flex-column justify-content-between">
					<div>
						<h1><b>{user.full_name}</b> ({user.username})</h1>
						{ seekerInfo && Object.keys(seekerInfo).length > 0 && 
							(<div className="d-flex justify-content-between">
								<p className="text-muted fs-2">Task Seeker</p>
								<p className="text-muted fs-2">{seekerInfo.overall_rating}★</p>
							</div>)
						}
						{ requesterInfo && Object.keys(requesterInfo).length > 0 && 
							(<div className="d-flex justify-content-between">
								<p className="text-muted fs-2">Requester</p>
								<p className="text-muted fs-2">{requesterInfo.overall_rating}★</p>
							</div>)
						}
						<p className="fs-3 text-muted">{user.description}</p>
					</div>
					<div className="d-flex justify-content-around">
						{	seekerInfo && Object.keys(seekerInfo).length > 0 &&
							<React.Fragment>
								<div className="text-center d-flex flex-column">
									<span className="fs-2"><b>Total Completed</b></span>
									<h2>{seekerInfo.total_completed_tasks}</h2>
								</div>
								<div className="text-center d-flex flex-column">
									<span className="fs-2"><b>Ongoing</b></span>
									<h2>{seekerInfo.total_ongoing_tasks}</h2>
								</div>
							</React.Fragment>
						}
						{	requesterInfo && Object.keys(requesterInfo).length > 0 &&
							<React.Fragment>
								<div className="text-center d-flex flex-column">
									<span className="fs-2"><b>Total Requested</b></span>
									<h2>{requesterInfo.total_requested_tasks}</h2>
								</div>
								<div className="text-center d-flex flex-column">
									<span className="fs-2"><b>Average Budget</b></span>
									<h2>{requesterInfo.average_budget}</h2>
								</div>
							</React.Fragment>
						}
					</div>
				</div>
			</div>
		</div>
	);
};

User.propTypes = {
	match: PropTypes.object
};
