import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import Task from "./task_card.jsx";

const CompletedTasksList = ({ role }) => {
    const { store } = useContext(Context);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        if(store.user.role != "none") loadInfo();
    }, [])

    useEffect(() => { loadInfo(); }, [store.notifications])

    const loadInfo = () => {
        fetch(process.env.BACKEND_URL + `/api/users/${store.user.id}/${role}/completed-tasks`)
        .then(response => response.json())
        .then(data => setTasks(data))
        .catch(error => console.error(error));
    }

    return (
        <div className="container-fluid px-5">
            <h3>Completed tasks as {role}</h3>
            <div className="row">
                {tasks.length === 0 ? (
                    <div>No tasks available</div>
                ) : (
                    tasks.slice().reverse().map((task) => {
                        return (
                            <React.Fragment key={task.id}>
                                <Task taskInfo={task}></Task>
                            </React.Fragment>
                        );
                    }
                ))}
            </div>
        </div>
    );
}

export default CompletedTasksList;