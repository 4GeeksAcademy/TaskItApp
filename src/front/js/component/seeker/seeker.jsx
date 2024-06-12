import React, { useContext } from "react";
import StarRating from "../rating/StarRating.jsx";
import { Link } from "react-router-dom";
import { Context } from "../../store/appContext.js";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router-dom";
import useScreenWidth from "../../hooks/useScreenWidth.jsx";

const Seeker = ({ seekerInfo, applicantInfo, applicants }) => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const smallDevice = useScreenWidth();

    const acceptSeeker = () => {
        for(let applicant of applicants) {
            if(applicant.id == applicantInfo.id) {
                actions.changePostulantStatus(applicant.id, "accepted");
                actions.sendNotification(`You have been accepted as the seeker of the task with ID: ${applicant.task_id}`, applicant.seeker.user.username);
            } else {
                actions.changePostulantStatus(applicant.id, "rejected");
                actions.sendNotification(`You have been rejected as the seeker of the task with ID: ${applicant.task_id}`, applicant.seeker.user.username);
            }
        }

        actions.changeTaskStatus(applicantInfo.task_id, "in_progress");
        actions.changeTaskSeeker(applicantInfo.task_id, seekerInfo.id);

        createChat();    
        navigate('/');    
    }

    const createChat = () => {
        const newChat = { 
            'room_name': String(store.user.id) + String(seekerInfo.user.id) + applicantInfo.task_id,
            'requester_id': store.user.id,
            'seeker_id': seekerInfo.user.id,
            'task_id': applicantInfo.task_id,
        };

		const config = { 
			method: "POST",
			body: JSON.stringify(newChat),
			headers: { 'Content-Type': 'application/json' }
		};
        
        fetch(process.env.BACKEND_URL + '/chats', config)
        .then(response => response.json())
        .catch(error => console.error(error))
    }

    return (
        <div className={`${applicantInfo ? "col-lg-7" : "col-lg-4"} col-12 p-2`}>
            <div className={`card p-4 ${applicantInfo?.status == "accepted" ? "border border-success" : applicantInfo?.status == "rejected" ? "border border-danger" : ""}`}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-dark me-2 overflow-hidden" style={{ height: "60px", width: "60px", aspectRatio: "1/1" }}>
                            { seekerInfo.user.profile_picture && <img
                                className="img-fluid"
                                src={seekerInfo.user.profile_picture}
                                alt="User Profile"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />}
                        </div>
                        <div className="d-flex flex-column justify-content-around">
                            <Link to={`/users/${seekerInfo.user.username}`}>
                                { !smallDevice 
                                    ? <span className="fs-5"><b>{seekerInfo.user.full_name}</b> <span className="text-muted"> ({seekerInfo.user.username})</span></span>
                                    : <span className="fs-5"><b>{seekerInfo.user.username}</b></span>
                                }
                            </Link>
                            <div className="d-flex align-items-center">
                                <StarRating value={seekerInfo.overall_rating}></StarRating>
                                <span className="text-muted ms-1">({seekerInfo.total_reviews})</span>
                            </div>
                        </div>
                    </div>
                </div>
                { applicantInfo && 
                    <div className={`d-flex justify-content-between mb-2 ${smallDevice ? "flex-column" : ""}`}>
                        <span><b>Applied</b> {actions.timeAgo(applicantInfo.application_date)}</span>
                        <span><Icon className="fs-4 me-2" icon="fa6-solid:money-bill-1-wave" /><b>Price: </b>{applicantInfo.price}€</span>
                    </div>
                }
                { applicantInfo ?  
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-green smooth" onClick={acceptSeeker}>Accept</button>
                        <button className="btn btn-orange smooth" onClick={() => actions.changePostulantStatus(applicantInfo.id, "rejected")}>Reject</button>
                        <Link to={`/users/${seekerInfo.user.username}`}>
                            <button className="btn btn-clear-green smooth">View</button>
                        </Link>
                    </div>
                    :
                    <div className="d-flex justify-content-between">
                        <Link to={`/users/${seekerInfo.user.username}`}>
                            <button className="btn btn-clear-green smooth">See Details</button>
                        </Link>
                    </div>
                }
            </div>
        </div>
    );
}

export default Seeker;