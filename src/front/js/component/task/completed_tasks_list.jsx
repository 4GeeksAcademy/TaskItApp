import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import Task from "./task_card.jsx";

const CompletedTasksList = ({ role }) => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        if(role == "requester") actions.getRequesterCompletedTasks();
        if(role == "seeker") actions.getSeekerCompletedTasks();
    }, [])

    useEffect (() => {
        if(role == "requester") actions.getRequesterCompletedTasks();
        if(role == "seeker") actions.getSeekerCompletedTasks();
    }, [store.notifications])

    return (
        <div className="container-fluid px-5">
            <h3>Completed tasks as {role}</h3>
            <div className="row">
                {role === "seeker" ? (
                    store.seekerCompletedTasks.length === 0 ? (
                        <div>No tasks available</div>
                    ) : (
                        store.seekerCompletedTasks.slice().reverse().map((task, index) => {
                            return (
                                <React.Fragment key={task.id + role}>
                                    <Task taskInfo={task} index={index} list={"seekerList"} ></Task>
                                </React.Fragment>
                            );
                        })
                    )
                ) : role === "requester" ? (
                    store.requesterCompletedTasks.length === 0 ? (
                        <div>No tasks available</div>
                    ) : (
                        store.requesterCompletedTasks.slice().reverse().map((task, index) => {
                            return (
                                <React.Fragment key={task.id + role} >
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