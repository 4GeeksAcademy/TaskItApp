import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext.js";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, useLocation } from "react-router-dom";
import TaskForm from "./task_form.jsx";
import RatingForm from "../rating/rating_form.jsx";

const Task = ({ taskInfo }) => {
    const { store, actions } = useContext(Context);
    const path = useLocation().pathname;
    const [show, setShow] = useState(false);
	const [showRatingForm, setShowRatingForm] = useState(false);
    const [showRateBtn, setShowRateBtn] = useState(true);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleCloseRatingForm = () => {
        setShowRatingForm(false);
        showRateButton();
    }
    const handleShowRatingForm = () => setShowRatingForm(true);

    const handleComplete = () => {
        actions.changeTaskStatus(taskInfo.id, "completed");
        actions.sendNotification(`The task with id ${taskInfo.id}, has been marked as completed.`, taskInfo.seeker.user.username);
    }
    
    const handleCancel = () => {
        actions.changeTaskStatus(taskInfo.id, "cancelled");
        if(taskInfo.seeker) actions.sendNotification(`The task with id ${taskInfo.id}, has been cancelled.`, taskInfo.seeker.user.username);
    }

    const showRateButton = () => {
        const userHasRated = taskInfo.ratings.some(rating => (rating.seeker_id !== store.user.seeker?.id  && rating.seeker_id === taskInfo.seeker.id) || (rating.requester_id !== store.user.requester?.id && rating.requester_id === taskInfo.requester_user.id));
        if (!userHasRated && taskInfo.ratings.length < 2) setShowRateBtn(true);
        else setShowRateBtn(false);
    }

    useEffect(() => { showRateButton(); }, [])

    return (
        <div className="col-lg-4 col-md-8 col-sm-11 p-2 d-flex flex-column">
            <div className="card p-4 h-100 d-flex flex-column justify-content-between flex-grow-1">
                <div>
                    <div className="w-100 d-flex justify-content-end gap-2">
                        { (taskInfo.status == "completed" && path == '/')
                            ? ( showRateBtn &&
                                <div className="rounded-circle overflow-hidden smooth" style={{ width: "auto", height: "auto" ,aspectRatio: "1/1" }}>
                                    <button className="btn btn-warning h-100" onClick={handleShowRatingForm}><Icon className="fs-5" icon="material-symbols:reviews-outline" /></button>
                                </div>
                            ) : ((store.user.id == taskInfo.requester_user?.id && taskInfo.status != "cancelled" && path == '/') && (
                                <>
                                    { taskInfo.seeker_id && 
                                        <div className="rounded-circle overflow-hidden smooth" style={{ width: "auto", height: "auto" ,aspectRatio: "1/1" }}>
                                            <button className="btn btn-success h-100" onClick={handleComplete}><Icon  className="fs-5" icon="fluent-mdl2:accept-medium" /></button>
                                        </div> 
                                    }
                                    <div className="rounded-circle overflow-hidden smooth" style={{ aspectRatio: "1/1", height: "auto", width: "auto" }}>
                                        <button className="btn btn-danger h-100 fs-3 close d-flex align-items-center" onClick={handleCancel}><span>&times;</span></button>
                                    </div>
                                    { taskInfo.status == "pending" &&
                                        <div className="rounded-circle overflow-hidden smooth d-flex align-items-center" style={{ width: "auto", height: "auto", aspectRatio: "1/1" }}>
                                            <button className="btn btn-dark h-100" onClick={handleShow}><Icon  className="fs-5" icon="mage:edit-fill" /></button>
                                        </div>
                                    }
                                </>
                            ))
                        }
                    </div>
                    { path != "/" &&
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
                                    { taskInfo.requester_user ? <Link to={`/users/${taskInfo.requester_user.username}`}><b>{taskInfo.requester_user.username} </b></Link> : <span>deleted </span> }
                                    <span className="text-muted">in {taskInfo.category_name}</span>
                                </span>
                                <span>{actions.timeAgo(taskInfo.creation_date)}</span>
                            </div>
                        </div>
                    }
                    <h2>{taskInfo.title}</h2>
                    <p className="text-muted">{taskInfo.description}</p>
                </div>
                <div>
                    <div className="d-flex align-items-end justify-content-between">
                        { path != "/"
                        ? <span className="fs-3 d-flex align-items-center"><Icon className="me-2" icon="ph:user-bold" /> <span>{taskInfo.applicants.length} {taskInfo.applicants.length == 1 ? "applicant" : "applicants"}</span></span>
                        : taskInfo.seeker_id 
                        ? <div className="d-flex flex-column">
                            <span><b>Status:</b> {taskInfo.status == "in_progress" ? "in progress" : taskInfo.status}</span>
                            <span><b>Task Seeker:</b> <Link to={`/users/${taskInfo.seeker?.user?.username}`}>{taskInfo.seeker?.user?.username}</Link></span>
                        </div>
                        : <Link to={`/tasks/${taskInfo.id}/applicants`}>
                            <button className="btn btn-dark smooth">
                                <span className="d-flex align-items-center">
                                    <Icon className="me-2" icon="ph:user-bold" /> 
                                    <span>{taskInfo.applicants.length} {taskInfo.applicants.length == 1 ? "applicant" : "applicants"}</span>
                                </span>
                            </button>
                        </Link>
                        }
                        <Link to={`/tasks/${taskInfo.id}`}>
                            <button className="btn btn-dark smooth">See Details</button>
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
                taskID={taskInfo.id}>
            </RatingForm>
        </div>
    );
}

export default Task;