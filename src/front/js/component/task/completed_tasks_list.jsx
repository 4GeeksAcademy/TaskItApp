import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import Task from "./task_card.jsx";
import { Link, useLocation } from "react-router-dom";

const CompletedTasksList = ({ role }) => {
    const { store, actions } = useContext(Context);
    const path = useLocation().pathname;

    useEffect(() => {
        if(role == "requester") actions.getRequesterCompletedTasks(path == '/');
        if(role == "seeker") actions.getSeekerCompletedTasks(path == '/');
    }, [])

    useEffect (() => {
        if(role == "requester") actions.getRequesterCompletedTasks(path == '/');
        if(role == "seeker") actions.getSeekerCompletedTasks(path == '/');
    }, [store.notifications])

    return (
        <div className="container-fluid mt-2 px-5 bg-light">
            { role == "seeker" 
            ? <h4>Completed Tasks { path == '/' && <Link className="btn btn-clear-green" to={`/users/${store.user.username}/completed-tasks`}>More</Link>}</h4>
            : <h4>Completed Requests { path == '/' && <Link className="btn btn-clear-green" to={`/users/${store.user.username}/completed-requests`}>More</Link>}</h4>
            }
            <div className="row">
                {role === "seeker" ? (
                    store.seekerCompletedTasks.length === 0 ? (
                        <div>No tasks available</div>
                    ) : (
                        store.seekerCompletedTasks.sort((a, b) => b.id - a.id).map((task, index) => {
                            return (
                                <React.Fragment key={task.id + role + "cts"}>
                                    <Task taskInfo={task} index={index} list={"seekerList"} ></Task>
                                </React.Fragment>
                            );
                        })
                    )
                ) : role === "requester" ? (
                    store.requesterCompletedTasks.length === 0 ? (
                        <div>No tasks available</div>
                    ) : (
                        store.requesterCompletedTasks.sort((a, b) => b.id - a.id).map((task, index) => {
                            return (
                                <React.Fragment key={task.id + role + "ctr"} >
                                    <Task taskInfo={task} index={index} list={"requesterList"} ></Task>
                                </React.Fragment>
                            );
                        })
                    )
                ) : <div>No role yet.</div> }
            </div>
        </div>
    );
}

export default CompletedTasksList;