import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import Task from "./task_card.jsx";
import SortBy from "../sort_by.jsx";

const TaskList = () => {
    const { store, actions } = useContext(Context);
    const [tasks, setTasks] = useState([]);

    useEffect(() => actions.getTasks(), []);  
    useEffect(() => setTasks(store.tasks), [store.tasks]);    

    const handleSort = (sortKey, sortOrder) => {
        const sortedTasks = [...tasks].sort((a, b) => {
            if (!a.hasOwnProperty(sortKey) || !b.hasOwnProperty(sortKey)) return 0; 
            if (sortKey === "budget") {
                const aValue = parseFloat(a[sortKey]) || 0;
                const bValue = parseFloat(b[sortKey]) || 0;
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }
    
            if (typeof a[sortKey] === 'number' && typeof b[sortKey] === 'number') {
                return sortOrder === 'asc' ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
            } else {
                const aValue = a[sortKey].toString();
                const bValue = b[sortKey].toString();
                return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
        });
    
        setTasks(sortedTasks);
    };

    return (
        <div className="container-fluid px-5 bg-light">
            <SortBy onSort={handleSort} />
            <div className="row">
                {tasks.map((task) => {
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