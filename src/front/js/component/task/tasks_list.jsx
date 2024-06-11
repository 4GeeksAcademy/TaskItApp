import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import Task from "./task_card.jsx";

const TaskList = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => actions.getTasks(), []);

    return (
        <div className="container-fluid px-5 bg-light">
            <div className="row">
                {store.tasks.slice().reverse().map((task) => {
                    return (
                        <React.Fragment key={task.id + "tl"}>
                            <Task taskInfo={task}></Task>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}

export default TaskList;