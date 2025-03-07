import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import StarRating from "../component/rating/StarRating.jsx";
import RatingCard from "../component/rating/rating_card.jsx";
import useScreenWidth from "../hooks/useScreenWidth.jsx";
import BackButton from "../component/back_button.js";

export const PhoneUser = () => {
	const { store, actions } = useContext(Context);
	const params = useParams();
    const smallDevice = useScreenWidth();

	const [user, setUser] = useState({});
	const [reviews, setReviews] = useState([])
	const [seekerInfo, setSeekerInfo] = useState({});
	const [requesterInfo, setRequesterInfo] = useState({});

	useEffect(() => { loadInfo(); }, [])
	
	useEffect(() => { if(params.theusername != user.username) loadInfo(); }, [params]);
	
	const loadInfo = async () => {
		const currentUser = await actions.getUserByUsername(params.theusername);
		setUser(currentUser);
		
		if(currentUser.role == "both"|| currentUser.role == "task_seeker") setSeekerInfo(await actions.getSeeker(currentUser.id));
		if(currentUser.role == "both"|| currentUser.role == "requester") setRequesterInfo(await actions.getRequester(currentUser.id));

		fetchReviews(currentUser)
	}

	const fetchReviews = async (currentUser) => {
        try {
            const response = await fetch(process.env.BACKEND_URL + `/api/users/${currentUser.id}/reviews`); 
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error(error);
        }
    };

	return (
		<div className="container pt-0">
			<div className="row d-flex justify-content-center mx-2">
				{ store.fromApplicants && <BackButton></BackButton> }
				<div className="col-12" >
					<div className="rounded overflow-hidden p-0 float-start">
						{ user.profile_picture && <img 
							className="img-fluid" 
							src={user.profile_picture} 
							alt="User Profile"
							style={{ height: "auto", objectFit: "cover" }}
						/>}
					</div>
				</div>
				<div className="col-12 d-flex flex-column justify-content-between">
					<div>
						<h1><b>{user.full_name}</b> ({user.username})</h1>
						{ requesterInfo && Object.keys(requesterInfo).length > 0 && 
							(<div className="d-flex justify-content-between">
								<span className="text-muted fs-2">Requester</span>
								<div className="d-flex align-items-center">
									<StarRating value={requesterInfo.overall_rating}></StarRating>
									<span className="text-muted ms-1">({requesterInfo.total_reviews})</span>
								</div>
							</div>)
						}
						{ seekerInfo && Object.keys(seekerInfo).length > 0 && 
							(<div className="d-flex justify-content-between">
								<span className="text-muted fs-2">Task Seeker</span>
								<div className="d-flex align-items-center">
									<StarRating value={seekerInfo.overall_rating}></StarRating>
									<span className="text-muted ms-1">({seekerInfo.total_reviews})</span>
								</div>
							</div>)
						}
						<p className="py-3 fs-3 text-muted">{user.description}</p>
					</div>
					<div className="d-flex flex-column justify-content-around gap-2">
                        {	requesterInfo && Object.keys(requesterInfo).length > 0 &&
							<div className="card d-flex justify-content-around flex-row">
								<div className="text-center d-flex flex-column col-4">
									<span className="fs-5"><b>Average Budget</b></span>
									<span className="fs-2 text-muted">{requesterInfo.average_budget.toFixed(2)}</span>
								</div>
								<div className="text-center d-flex flex-column col-4">
									<span className="fs-5"><b>Total Requested</b></span>
									<span className="fs-2 text-muted">{requesterInfo.total_requested_tasks}</span>
								</div>
								<div className="text-center d-flex flex-column col-4 align-self-end">
									<span className="fs-5"><b>Open</b></span>
									<span className="fs-2 text-muted">{requesterInfo.total_open_tasks}</span>
								</div>
							</div>
						}
						{	seekerInfo && Object.keys(seekerInfo).length > 0 &&
							<div className="card d-flex justify-content-around flex-row">
								<div className="text-center d-flex flex-column">
									<span className="fs-5"><b>Total Completed</b></span>
									<span className="fs-2 text-muted">{seekerInfo.total_completed_tasks}</span>
								</div>
								<div className="text-center d-flex flex-column">
									<span className="fs-5"><b>Ongoing</b></span>
									<span className="fs-2 text-muted">{seekerInfo.total_ongoing_tasks}</span>
								</div>
							</div>
						}
					</div>
				</div>
				{ reviews.length > 0 && <hr className="my-5"></hr> }
                    <div className={`d-flex justify-content-between ${smallDevice ? "flex-column gap-3" : ""}`}>
                        { reviews.map((review) =>{
                            return <RatingCard key={review.id + 'urev'} rating={review} />
                        })}
				</div>
			</div>
		</div>
	);
};

PhoneUser.propTypes = {
	match: PropTypes.object
};
