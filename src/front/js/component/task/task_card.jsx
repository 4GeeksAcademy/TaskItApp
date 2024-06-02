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
        <div className="col-6 p-2">
            <div className="card p-4">
                {store.user.id == taskInfo.requester_user?.id  && (
                    <div className="w-100">
                        <button className="btn btn-dark px-4 float-end smooth" onClick={handleShow}>
                            <Icon icon="mage:edit-fill" /> Edit
                        </button>
                    </div>
                )}
                { path != "/" &&
                    <div className="d-flex align-items-center mb-2">
                        <div className="rounded-circle bg-dark me-2" style={{ height: "60px", width: "60px" }}></div>
                        <div className="d-flex flex-column justify-content-around">
                            <span className="fs-5"><b>{taskInfo.requester_user.username}</b> <span className="text-muted">in {taskInfo.category_name}</span></span>
                            <span>{actions.timeAgo(taskInfo.creation_date)}</span>
                        </div>
                    </div>
                }
                <h2>{taskInfo.title}</h2>
                <p className="text-muted">{taskInfo.description}</p>
                <div className="d-flex align-items-center justify-content-between">
                    { path != "/" 
                    ? <span className="fs-3 d-flex align-items-center"><Icon className="me-2" icon="ph:user-bold" /> <span>{taskInfo.applicants.length} {taskInfo.applicants.length == 1 ? "applicant" : "applicants"}</span></span>
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