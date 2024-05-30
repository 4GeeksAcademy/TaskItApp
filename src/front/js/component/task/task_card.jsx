import React, { useContext, useState } from "react";
import { Context } from "../../store/appContext.js";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

const Task = ({ taskInfo }) => {
    console.log(taskInfo)

    function timeAgo(isoTime) {
        const now = new Date();
        const time = new Date(isoTime);
        const diff = now - time;
            
        console.log("Current Time: ", now);
        console.log("Input Time: ", time);
        console.log("Difference in milliseconds: ", diff);

        const seconds = Math.floor(diff / 1000);
    
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };
    
        for (const [unit, secondsInterval] of Object.entries(intervals)) {
            const intervalCount = Math.floor(seconds / secondsInterval);
            if (intervalCount >= 1) {
                return `${intervalCount} ${unit}${intervalCount === 1 ? '' : 's'} ago`;
            }
        }
    
        return 'Just now';
    }

    return (
        <div className="col-6 p-2">
            <div className="card p-4">
                <div className="d-flex align-items-center mb-2">
                    <div className="rounded-circle bg-dark me-2" style={{ height: "60px", width: "60px" }}></div>
                    <div className="d-flex flex-column justify-content-around">
                        <span className="fs-5"><b>{taskInfo.requester_user.username}</b> <span className="text-muted">in {taskInfo.category_name}</span></span>
                        <span>{timeAgo(taskInfo.creation_date)}</span>
                    </div>
                </div>
                <h2>{taskInfo.title}</h2>
                <p className="text-muted">{taskInfo.description}</p>
                <div className="d-flex align-items-center justify-content-between">
                    <span className="fs-3 d-flex align-items-center"><Icon className="me-2" icon="ph:user-bold" /> <span>{taskInfo.applicants.length} {taskInfo.applicants.length == 1 ? "applicant" : "applicants"}</span></span>
                    <Link to={`/tasks/${taskInfo.id}`}>
						<button className="btn btn-dark smooth">See Details</button>
					</Link>
                </div>
            </div>
        </div>
    );
}

export default Task;