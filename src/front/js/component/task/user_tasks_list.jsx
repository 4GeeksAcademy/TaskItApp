import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import Task from "./task_card.jsx";

const UserTaskList = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        if(store.user.role == "requester" || store.user.role == "both"){
            actions.getUserTasks();
        }
    }, [])

    useEffect(() => { actions.getUserTasks(); }, [store.notifications])   

    return (
        <div className="container-fluid px-5 bg-light">
            <h3>My tasks</h3>
            <div className="row">
                {store.userTasks.length === 0 ? (
                    <div>No tasks available</div>
                ) : (
                    store.userTasks.slice().reverse().map((task, index) => {
                        return (
                            <React.Fragment key={task.id + "utl"}>
                                <Task taskInfo={task} index={index} list={"userTasks"}></Task>
                            </React.Fragment>
                        );
                    }
                ))}
            </div>
        </div>
    );
}

export default UserTaskList;