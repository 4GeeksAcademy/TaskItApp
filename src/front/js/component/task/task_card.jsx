import React, { useContext, useState } from "react";
import { Context } from "../../store/appContext.js";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, useLocation } from "react-router-dom";
import TaskForm from "./task_form.jsx";

const Task = ({ taskInfo }) => {
    const { store, actions } = useContext(Context);
    const path = useLocation().pathname;
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div className="col-lg-6 col-md-8 col-sm-11 p-2">
            <div className="card p-4">
                {(store.user.id == taskInfo.requester_user?.id && taskInfo.status != "cancelled" && path == '/') && (
                    <div className="w-100 d-flex justify-content-end gap-2">
                        <div className="rounded-circle overflow-hidden smooth" style={{ width: "auto" ,aspectRatio: "1/1" }}>
                            <button className="btn btn-success h-100" onClick={() => actions.changeTaskStatus(taskInfo.id, "completed")}><Icon icon="fluent-mdl2:accept-medium" /></button>
                        </div>
                        <div className="rounded-circle overflow-hidden smooth" style={{ aspectRatio: "1/1", height: "auto", width: "auto" }}>
                            <button className="btn btn-danger h-100 fs-3 close d-flex align-items-center" onClick={() => actions.changeTaskStatus(taskInfo.id, "cancelled")}><span>&times;</span></button>
                        </div>
                        <div className="rounded-circle overflow-hidden smooth d-flex align-items-center" style={{ width: "auto" ,aspectRatio: "1/1" }}>
                            <button className="btn btn-dark h-100" onClick={handleShow}><Icon icon="mage:edit-fill" /></button>
                        </div>
                    </div>
                )}
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

            <TaskForm show={show} handleClose={handleClose} currentTask={taskInfo}></TaskForm>
        </div>
    );
}

export default Task;