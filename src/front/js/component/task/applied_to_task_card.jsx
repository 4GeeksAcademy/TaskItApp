import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext.js";
import { Link } from "react-router-dom";
import useScreenWidth from "../../hooks/useScreenWidth.jsx";

const AppliedToTask = ({ taskInfo }) => {
    const { store, actions } = useContext(Context);
    const [applicantInfo, setApplicantInfo] = useState({})
    const smallDevice = useScreenWidth();

    useEffect(() => {
        for(let applicant of taskInfo.applicants) if(applicant.seeker_id == store.user.seeker?.id) setApplicantInfo(applicant);
    }, [])

    return (
        <div className="col-lg-4 col-12 p-2 d-flex flex-column">
            <div className={`card p-4 d-flex justify-content-between ${applicantInfo?.status == "accepted" ? "border border-success" : applicantInfo?.status == "rejected" ? "border border-danger" : ""} h-100 flex-grow-1`}>
                <div>
                    <div className="d-flex align-items-center mb-2">
                        <div className="rounded-circle bg-dark me-2 overflow-hidden" style={{ height: "60px", width: "60px" }}>
                            { taskInfo.requester_user?.profile_picture && <img
                                className="img-fluid"
                                src={taskInfo.requester_user?.profile_picture}
                                alt="User Profile"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />}
                        </div>
                        <div className="d-flex flex-column justify-content-around">
                            <span className="fs-5">
                                <Link to={`/users/${taskInfo.requester_user.username}`}><b>{taskInfo.requester_user.username} </b></Link> 
                                { !smallDevice && <span className="text-muted">in {taskInfo.category_name}</span>}
                            </span>
                            <span>{actions.timeAgo(taskInfo.creation_date)}</span>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-between flex-row">
                    <h2>{taskInfo.title}</h2>
                    <small className="text-muted"><b>ID: </b>{taskInfo.id}</small>
                </div>
                <p className="text-muted">{taskInfo.description}</p>
                <div className="d-flex align-items-end justify-content-between">
                    <span><b>Status: </b>{applicantInfo.status}</span>
                    <Link to={`/tasks/${taskInfo.id}`}>
                        <button className="btn btn-green smooth">See Details</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AppliedToTask;