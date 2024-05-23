import React, { useState } from 'react';
import TaskForm from './task_form.jsx';

const PostTask = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div>
            <button type="button" className="btn btn-primary" onClick={handleShow}>Post Task</button>

            <TaskForm show={show} handleClose={handleClose}></TaskForm>
        </div>
    );
}

export default PostTask;