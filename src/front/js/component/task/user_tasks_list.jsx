import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import Task from "./task_card.jsx";

const UserTaskList = () => {
    const { store } = useContext(Context);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetch(process.env.BACKEND_URL + `/api/users/${store.user.id}/tasks`)
        .then(response => response.json())
        .then(data => setTasks(data))
        .catch(error => console.error(error));
    }, [])
    

    return (
        <div className="container-fluid px-5">
            <div className="row">
                {tasks.map((task) => {
                    return (
                        <React.Fragment key={task.id}>
                            <Task taskInfo={task}></Task>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}

export default UserTaskList;