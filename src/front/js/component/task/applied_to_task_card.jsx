import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext.js";
import { Link } from "react-router-dom";

const AppliedToTask = ({ taskInfo }) => {
    const { store, actions } = useContext(Context);
    const [applicantInfo, setApplicantInfo] = useState({})

    useEffect(() => {
        for(let applicant of taskInfo.applicants) if(applicant.seeker_id == store.user.seeker?.id) setApplicantInfo(applicant);
    }, [])

    return (
        <div className="col-6 p-2">
            <div className={`card p-4 ${applicantInfo?.status == "accepted" ? "border border-success" : applicantInfo?.status == "rejected" ? "border border-danger" : ""}`}>
                <div className="d-flex align-items-center mb-2">
                    <div className="rounded-circle bg-dark me-2" style={{ height: "60px", width: "60px" }}></div>
                    <div className="d-flex flex-column justify-content-around">
                        <span className="fs-5">
                            <Link to={`/users/${taskInfo.requester_user.username}`}><b>{taskInfo.requester_user.username} </b></Link> 
                            <span className="text-muted">in {taskInfo.category_name}</span>
                        </span>
                        <span>{actions.timeAgo(taskInfo.creation_date)}</span>
                    </div>
                </div>
                <h2>{taskInfo.title}</h2>
                <p className="text-muted">{taskInfo.description}</p>
                <div className="d-flex align-items-end justify-content-between">
                    <span><b>Status: </b>{applicantInfo.status}</span>
                    <Link to={`/tasks/${taskInfo.id}`}>
                        <button className="btn btn-dark smooth">See Details</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AppliedToTask;