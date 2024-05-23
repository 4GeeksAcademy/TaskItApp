import React from "react";

const Task = ({ taskInfo }) => {

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div>
            <h2>{taskInfo.title}</h2>
            <p>{taskInfo.description}</p>
            <p><b>Creation date: </b>{formatDate(taskInfo.creation_date)}</p>
            <p><b>Due date: </b>{formatDate(taskInfo.due_date)}</p>
            <p><b>Delivery location: </b>{taskInfo.delivery_location}</p>
            <p><b>Pickup location: </b>{taskInfo.pickup_location}</p>
        </div>
    );
}

export default Task;