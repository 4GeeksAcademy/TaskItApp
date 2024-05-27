import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import Task from "./task.jsx";

const TaskList = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => actions.getTasks(), []);

    return (
        <div>
            {store.tasks.map((task) => {
                return (
                    <React.Fragment key={task.id}>
                        <Task taskInfo={task}></Task>
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export default TaskList;