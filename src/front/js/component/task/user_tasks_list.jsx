import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import Task from "./task_card.jsx";
import { Link, useLocation } from "react-router-dom";

const UserTaskList = () => {
    const { store, actions } = useContext(Context);
    const path = useLocation().pathname;

    useEffect(() => {
        if(store.user.role == "requester" || store.user.role == "both"){
            actions.getUserTasks(path == "/" ? true : false);
        }
    }, [])

    useEffect(() => { 
        actions.getUserTasks((path == "/" ? true : false)); 
    }, [store.notifications, path])   

    return (
        <div className="container-fluid mt-2 px-5 bg-light">
            <h4>Active Requests { path == '/' && <Link className="btn btn-clear-green" to={`/users/${store.user.username}/active-requests`}>More</Link>}</h4>
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