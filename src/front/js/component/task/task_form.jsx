import React, { useState, useContext, useEffect } from 'react';
import { Modal, ModalTitle } from 'react-bootstrap';
import { Context } from '../../store/appContext.js';
import Alert from '../alert.jsx';

const TaskForm = (props) => {
    const { store, actions } = useContext(Context);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [pickupAddress, setPickupAddress] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        if (Object.keys(store.categories).length == 0) actions.getCategories();
        if(props.currentTask) {
            setTitle(props.currentTask.title);
            setDescription(props.currentTask.description);
            setPickupAddress(props.currentTask.pickup_location);
            setDeliveryAddress(props.currentTask.delivery_location);
            setDueDate(props.currentTask.due_date.split("T")[0]);
            setCategory(props.currentTask.category);
        }
    }, [])

    const handleSubmit = () => {
        event.preventDefault();
        if(props.currentTask) actions.editTask(props.currentTask.id, title, description, pickupAddress, deliveryAddress, dueDate);
        else actions.addTask(title, description, pickupAddress, deliveryAddress, dueDate, category);
    };

    return (
        <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header>
                <ModalTitle>Task Information</ModalTitle>
                <button className="btn close" data-dismiss="modal" aria-label="Close" onClick={props.handleClose}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </Modal.Header>
            <Modal.Body>
                {(store.message || store.error) && <Alert message={store.message} error={store.error} ></Alert>}

                <form id="task-form" onSubmit={() => handleSubmit()}>
                    <label htmlFor='title'>Title</label>
                    <input type="text" className="form-control" placeholder="Title" aria-label="Title" id='title' aria-describedby="basic-addon1" value={title} onChange={(e) => setTitle(e.target.value)} />

                    <label htmlFor='category-select'>Category</label>
                    <select 
                        className="form-select select-options" 
                        aria-label="category list" 
                        id="category-select"
                        value={category}
                        onChange={(e) => {setCategory(e.target.value); console.log(store.categories, e.target.value)}}
                    >
                        <option value="" disabled>Choose category</option>
                        {store.categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>

                    <label htmlFor='description'>Description</label>
                    <textarea className="form-control" aria-label="description" maxLength="500" rows="5" value={description} onChange={(e) => setDescription(e.target.value)} ></textarea>
                    
                    <label htmlFor='pickup-address'>Pickup Address</label>
                    <input type="text" className="form-control" placeholder="4 Privet Drive" aria-label="pickup address" id='pìckup-address' aria-describedby="basic-addon1" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} />

                    <label htmlFor='delivery-address'>Delivery Address</label>
                    <input type="text" className="form-control" placeholder="4 Privet Drive" aria-label="delivery address" id='delivery-address' aria-describedby="basic-addon1" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} />

                    <label htmlFor='due-date'>Due Date</label>
                    <input type="date" className="form-control" aria-label="due date" id='due-date' aria-describedby="basic-addon1" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-secondary" onClick={props.handleClose}>Close</button>
                <button type="submit" form="task-form" className="btn btn-primary">Post</button>
            </Modal.Footer>
        </Modal>
    );
}

export default TaskForm;