import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import AppliedToTask from "./applied_to_task_card.jsx";

const AppliedToTaskList = () => {
    const { store } = useContext(Context);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        if(store.user.role == "task_seeker" || store.user.role == "both"){
            fetch(process.env.BACKEND_URL + `/api/users/${store.user.id}/applied-to-tasks`)
            .then(response => response.json())
            .then(data => setTasks(data))
            .catch(error => console.error(error));
        }
    }, [])
    

    return (
        <div className="container-fluid px-5">
            <h3>Applied to tasks</h3>
            <div className="row">
                { tasks.length == 0 
                    ? <div>You haven't applied to tasks yet.</div>
                    : tasks.slice().reverse().map((task) => {
                        return (
                            <React.Fragment key={task.id}>
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