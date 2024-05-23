import React, { useState } from 'react';

const TaskForm = ({ handleSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [pickupAddress, setPickupAddress] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [dueDate, setDueDate] = useState('');

    return (
        <form id="task-form" onSubmit={() => handleSubmit(title, description, pickupAddress, deliveryAddress, dueDate)}>
            <label htmlFor='title'>Title</label>
            <input type="text" className="form-control" placeholder="Title" aria-label="Title" id='title' aria-describedby="basic-addon1" value={title} onChange={(e) => setTitle(e.target.value)} />

            <label htmlFor='description'>Description</label>
            <textarea className="form-control" aria-label="description" maxLength="500" rows="5" value={description} onChange={(e) => setDescription(e.target.value)} ></textarea>
            
            <label htmlFor='pickup-address'>Pickup Address</label>
            <input type="text" className="form-control" placeholder="4 Privet Drive" aria-label="pickup address" id='pìckup-address' aria-describedby="basic-addon1" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} />

            <label htmlFor='delivery-address'>Delivery Address</label>
            <input type="text" className="form-control" placeholder="4 Privet Drive" aria-label="delivery address" id='delivery-address' aria-describedby="basic-addon1" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} />

            <label htmlFor='due-date'>Due Date</label>
            <input type="date" className="form-control" aria-label="due date" id='due-date' aria-describedby="basic-addon1" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </form>
    );
}

export default TaskForm;