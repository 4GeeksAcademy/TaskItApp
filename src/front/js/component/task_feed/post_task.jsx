import React, { useContext, useState } from 'react';
import { Modal, ModalTitle } from 'react-bootstrap';
import TaskForm from './task_form.jsx';
import Alert from '../alert.jsx';
import { Context } from '../../store/appContext.js';

const PostTask = () => {
    const [show, setShow] = useState(false);
    const { store, actions } = useContext(Context);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = (title, description, pickupAddress, deliveryAddress, dueDate) => {
        event.preventDefault();
        console.log(dueDate)
        actions.addTask(title, description, pickupAddress, deliveryAddress, dueDate);
    };

    return (
        <div>
            <button type="button" className="btn btn-primary" onClick={handleShow}>Post Task</button>

            <Modal show={show} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header>
                    <ModalTitle>Task Information</ModalTitle>
                    <button className="btn close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    {(store.message || store.error) && <Alert message={store.message} error={store.error} ></Alert>}
                    <TaskForm handleSubmit={handleSubmit}></TaskForm>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                    <button type="submit" form="task-form" className="btn btn-primary">Post</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default PostTask;