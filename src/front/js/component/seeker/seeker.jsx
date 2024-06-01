import React from "react";
import StarRating from "../rating/StarRating.jsx";
import { Link } from "react-router-dom";

const Seeker = ({ seekerInfo }) => {
    console.log(seekerInfo)
    return (
        <div className="col-6 p-2">
            <div className="card p-4">
                <div className="d-flex align-items-center mb-2">
                    <div className="rounded-circle bg-dark me-2" style={{ height: "60px", width: "60px" }}></div>
                    <div className="d-flex flex-column justify-content-around">
                        <span className="fs-5"><b>{seekerInfo.user.full_name}</b> <span className="text-muted"> ({seekerInfo.user.username})</span></span>
                        <div className="d-flex align-items-center">
							<StarRating value={seekerInfo.overall_rating}></StarRating>
							<span className="text-muted ms-1">({seekerInfo.total_reviews})</span>
						</div>
                    </div>
                </div>
                <div>
                    <button className="btn btn-dark smooth">Contact</button>
                    <Link className="float-end" to={`/users/${seekerInfo.user.username}`}>
                        <button className="btn btn-dark smooth">See Details</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Seeker;