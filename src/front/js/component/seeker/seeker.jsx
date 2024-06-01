import React, { useContext } from "react";
import StarRating from "../rating/StarRating.jsx";
import { Link } from "react-router-dom";
import { Context } from "../../store/appContext.js";
import { Icon } from "@iconify/react/dist/iconify.js";

const Seeker = ({ seekerInfo, applicantInfo }) => {
    const { actions } = useContext(Context);

    return (
        <div className={`${applicantInfo ? "col-7" : "col-6"} p-2`}>
            <div className="card p-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-dark me-2" style={{ height: "60px", width: "60px" }}></div>
                        <div className="d-flex flex-column justify-content-around">
                            <span className="fs-5"><b>{seekerInfo.user.full_name}</b> <span className="text-muted"> ({seekerInfo.user.username})</span></span>
                            <div className="d-flex align-items-center">
                                <StarRating value={seekerInfo.overall_rating}></StarRating>
                                <span className="text-muted ms-1">({seekerInfo.total_reviews})</span>
                            </div>
                        </div>
                    </div>
                    { applicantInfo &&
                        <div>
                            <button className="btn btn-dark smooth">Contact</button>
                            <Link className="ms-2" to={`/users/${seekerInfo.user.username}`}>
                                <button className="btn btn-dark smooth">See Details</button>
                            </Link>
                        </div>
                    }
                </div>
                { applicantInfo && 
                    <div className="d-flex justify-content-between mb-2">
                        <span><b>Applied</b> {actions.timeAgo(applicantInfo.application_date)}</span>
                        <span><Icon className="fs-4 me-2" icon="fa6-solid:money-bill-1-wave" /><b>Price: </b>{applicantInfo.price}€</span>
                    </div>
                }
                { applicantInfo ?  
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-success smooth">Accept</button>
                        <button className="btn btn-danger smooth">Reject</button>
                    </div>
                    :
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-dark smooth">Contact</button>
                        <Link className="ms-2" to={`/users/${seekerInfo.user.username}`}>
                            <button className="btn btn-dark smooth">See Details</button>
                        </Link>
                    </div>
                }
            </div>
        </div>
    );
}

export default Seeker;