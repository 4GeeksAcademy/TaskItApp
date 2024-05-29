import React, { useContext, useState } from "react";
import { Context } from "../../store/appContext";
import TaskForm from "./task_form.jsx";
import Map from "../geocoding/map.jsx";

const Task = ({ taskInfo }) => {
    const { actions } = useContext(Context);

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div className="container">
            <div className="card mb-2">
                <h2>{taskInfo.title}</h2>
                <p>{taskInfo.description}</p>
                <p><b>Creation date: </b>{formatDate(taskInfo.creation_date)}</p>
                <p><b>Due date: </b>{formatDate(taskInfo.due_date)}</p>
                <p><b>Delivery location: </b>{taskInfo.delivery_address.address}</p>
                <p><b>Pickup location: </b>{taskInfo.pickup_address.address}</p>
                <button className="btn btn-primary" onClick={handleShow}>Edit</button>
                <button className="btn btn-danger" onClick={() => actions.deleteTask(taskInfo.id)}>Delete</button>
                <Map markers={[[taskInfo.delivery_address.latitude, taskInfo.delivery_address.longitude], [taskInfo.pickup_address.latitude, taskInfo.pickup_address.longitude]]}></Map>
            </div>

            <TaskForm show={show} handleClose={handleClose} currentTask={taskInfo}></TaskForm>
        </div>
    );
}

export default Task;