import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import AppliedToTask from "./applied_to_task_card.jsx";
import { Link, useLocation } from "react-router-dom";

const AppliedToTaskList = () => {
    const { store } = useContext(Context);
    const [tasks, setTasks] = useState([]);
    const path = useLocation().pathname;

    useEffect(() => {
        if (store.user.role === "task_seeker" || store.user.role === "both") {
            loadInfo(path == '/'); 
        }
    }, [store.user.role]);

    useEffect(() => {
        loadInfo(path == '/'); 
    }, [store.notifications]);

    const loadInfo = (last) => {
        if(!last && path == '/') return;
        fetch(process.env.BACKEND_URL + `/api/users/${store.user.id}/applications/${last ? "?last=true" : ""}`)
        .then(response => response.json())
        .then(data => setTasks(data))
        .catch(error => console.error(error));
    }
    

    return (
        <div className="container-fluid mt-2 px-5 bg-light">
            <h4>Applications { path == '/' && <Link className="btn btn-clear-green" to={`/users/${store.user.username}/applications`}>More</Link>}</h4>
            <div className="row">
                { tasks.length == 0 
                    ? <div>You haven't applied to tasks yet.</div>
                    : tasks.slice().reverse().map((task) => {
                        return (
                            <React.Fragment key={task.id + "att"}>
                                <AppliedToTask taskInfo={task}></AppliedToTask>
                            </React.Fragment>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default AppliedToTaskList;