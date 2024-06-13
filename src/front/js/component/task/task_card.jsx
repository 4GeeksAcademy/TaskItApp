import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext.js";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, useLocation } from "react-router-dom";
import TaskForm from "./task_form.jsx";
import RatingForm from "../rating/rating_form.jsx";
import useScreenWidth from "../../hooks/useScreenWidth.jsx";
import "../../../styles/better-buttons.css"

const Task = ({ taskInfo }) => {
    const { store, actions } = useContext(Context);
    const path = useLocation().pathname;
    const isUserTasksPage = /^\/users\/[^/]+\/active-requests$/.test(path);
    const isUserCompletedTasksPage = /^\/users\/[^/]+\/completed-tasks$/.test(path);
    const isUserCompletedRequestsPage = /^\/users\/[^/]+\/completed-requests$/.test(path);
    const smallDevice = useScreenWidth();
    const [show, setShow] = useState(false);
	const [showRatingForm, setShowRatingForm] = useState(false);
    const [showRateBtn, setShowRateBtn] = useState(true);
    const [status, setStatus] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleCloseRatingForm = () => {
        setShowRatingForm(false);
        setShowRateBtn(false);
    }

    const handleShowRatingForm = () => setShowRatingForm(true);

    const handleComplete = () => {
        actions.changeTaskStatus(taskInfo.id, "completed");
        setStatus("completed");
        actions.sendNotification(`The task with id ${taskInfo.id}, has been marked as completed.`, taskInfo.seeker.user.username);
    }
    
    const handleCancel = () => {
        actions.changeTaskStatus(taskInfo.id, "cancelled");
        setStatus("cancelled");
        if(taskInfo.seeker) actions.sendNotification(`The task with id ${taskInfo.id}, has been cancelled.`, taskInfo.seeker.user.username);
    }

    const showRateButton = () => {
        const userHasRated = taskInfo.ratings.some(rating => (rating.seeker_id !== store.user.seeker?.id  && rating.seeker_id === taskInfo.seeker.id) || (rating.requester_id !== store.user.requester?.id && rating.requester_id === taskInfo.requester_user.id));
        if (!userHasRated && taskInfo.ratings.length < 2) setShowRateBtn(true);
        else setShowRateBtn(false);
    }

    useEffect(() => { showRateButton(); }, [])

    return (
        <div className="col-xl-4 col-12 p-2 d-flex flex-column">
            <div className="card p-4 h-100 d-flex flex-column justify-content-between flex-grow-1">
                <div>
                    <div className="w-100 d-flex justify-content-end gap-2">
                        { ((taskInfo.status == "completed" || status == "completed") && (path == '/' || isUserTasksPage || isUserCompletedRequestsPage))
                            ? ( showRateBtn &&
                                <button className="tc-btn yellow" onClick={handleShowRatingForm}> 
                                    <Icon icon="material-symbols:reviews-outline" />
                                    <span className="tc-btn-text">Rate</span> 
                                </button>
                            ) : ((store.user.id == taskInfo.requester_user?.id && (taskInfo.status != "cancelled" || status != "cancelled") && (path == '/' || isUserTasksPage || isUserCompletedRequestsPage)) && (
                                <>
                                    { taskInfo.seeker_id && 
                                        <button className="tc-btn green" onClick={handleComplete}> 
                                            <Icon icon="fluent-mdl2:accept-medium" />
                                            <span className="tc-btn-text">Complete</span> 
                                        </button>
                                    }
                                    <button className="tc-btn orange" onClick={handleCancel}> 
                                        <Icon icon="tabler:trash" />
                                        <span className="tc-btn-text">Delete</span> 
                                    </button>
                                    { taskInfo.status == "pending" &&
                                        <button className="tc-btn dark" onClick={handleShow}> 
                                            <Icon icon="basil:edit-outline" />
                                            <span className="tc-btn-text">Edit</span> 
                                        </button>
                                    }
                                </>
                            ))
                        }
                    </div>
                    { ((path != '/' && !isUserTasksPage && !isUserCompletedTasksPage && !isUserCompletedRequestsPage) || store.user.id != taskInfo.requester_user?.id) &&
                        <div className="d-flex align-items-center mb-2">
                            <div className="rounded-circle bg-dark me-2 overflow-hidden" style={{ height: "60px", width: "60px", aspectRatio: "1/1" }}>
                                { taskInfo.requester_user?.profile_picture && <img
                                    className="img-fluid"
                                    src={taskInfo.requester_user?.profile_picture}
                                    alt="User Profile"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />}
                            </div>
                            <div className="d-flex flex-column justify-content-around">
                                <span className="fs-5">
                                    { taskInfo.requester_user ? <Link to={`/users/${taskInfo.requester_user.username}`}><b>{taskInfo.requester_user.username} </b></Link> : <span>deleted </span> }
                                    { !smallDevice && <span className="text-muted">in {taskInfo.category_name}</span>}
                                </span>
                                <span>{actions.timeAgo(taskInfo.creation_date)}</span>
                            </div>
                        </div>
                    }
                    <div className="d-flex justify-content-between flex-row">
                        <h2 className="col-10">{taskInfo.title}</h2>
                        <div className="col-2">
                            <small className="text-muted float-end"><b>ID: </b>{taskInfo.id}</small>
                        </div>
                    </div>
                    <p className="text-muted">{taskInfo.description}</p>
                </div>
                <div>
                    <div className={`d-flex justify-content-between`}>
                        { (path != '/' && !isUserTasksPage && !isUserCompletedTasksPage)
                        ? <div><span className="fs-3 d-flex align-items-center"><Icon className="me-2" icon="ph:user-bold" /> <span>{taskInfo.applicants.length} { smallDevice ? "" : (taskInfo.applicants.length == 1 ? "applicant" : "applicants")}</span></span></div>
                        : taskInfo.seeker_id 
                        ? <div className="d-flex flex-column">
                            <span><b>Status:</b> {taskInfo.status == "in_progress" ? "in progress" : taskInfo.status}</span>
                            <span><b>Task Seeker:</b> <Link to={`/users/${taskInfo.seeker?.user?.username}`}>{taskInfo.seeker?.user?.username}</Link></span>
                        </div>
                        : <Link to={`/tasks/${taskInfo.id}/applicants`}>
                            <button className="btn btn-clear-dark smooth">
                                <span className="d-flex align-items-center">
                                    <Icon className="me-2" icon="ph:user-bold" /> 
                                    <span>{taskInfo.applicants.length} {smallDevice ? "" : (taskInfo.applicants.length == 1 ? "applicant" : "applicants")}</span>
                                </span>
                            </button>
                        </Link>
                        }
                        <Link to={`/tasks/${taskInfo.id}`}>
                            <button className="btn btn-green smooth">{smallDevice ? "Details" : "See Details"}</button>
                        </Link>
                    </div>
                </div>
            </div>

            <TaskForm show={show} handleClose={handleClose} currentTask={taskInfo}></TaskForm>
            <RatingForm 
                show={showRatingForm} 
                handleClose={handleCloseRatingForm} 
                role={store.user.id == taskInfo.requester_user?.id ? "requester" : "seeker"} 
                id={store.user.id === taskInfo.requester_user?.id ? taskInfo.seeker?.id : taskInfo.requester_user?.id} 
                username={store.user.id === taskInfo.requester_user?.id ? taskInfo.seeker?.user.username : taskInfo.requester_user?.username} 
                taskID={taskInfo.id}
                setShowBtn={setShowRateBtn}
            />
        </div>
    );
}

export default Task;