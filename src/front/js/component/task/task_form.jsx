import React, { useState, useContext, useEffect } from 'react';
import { Modal, ModalTitle } from 'react-bootstrap';
import { Context } from '../../store/appContext.js';
import Alert from '../alert.jsx';
import AddressInput from '../geocoding/address_input.jsx'

const TaskForm = (props) => {
    const { store, actions } = useContext(Context);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [pickupAddress, setPickupAddress] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [category, setCategory] = useState('');
    const [budget, setBudget] = useState(0);

    useEffect(() => {
        actions.resetMessages();
        if (Object.keys(store.categories).length == 0) actions.getCategories();
        if(props.currentTask) {
            setTitle(props.currentTask.title || '');
            setDescription(props.currentTask.description || '');
            setPickupAddress(props.currentTask.pickup_address?.address || '');
            setDeliveryAddress(props.currentTask.delivery_address?.address || '');
            setDueDate(props.currentTask.due_date?.split("T")[0] || '');
            setCategory(props.currentTask.category || '');
            setBudget(props.currentTask.budget || 0);
        } else resetStates();
    }, [props.show])

    useEffect(() => {
        if(store.message == "Task posted successfully." || store.message == "Task edited successfully.") {
            if(props.loadInfo) props.loadInfo();
            props.handleClose();
        }
    }, [store.message])

    const resetStates = () => {
        setTitle("");
        setDescription("");
        setPickupAddress("");
        setDeliveryAddress("");
        setDueDate("");
        setCategory("");
        setBudget(0);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (props.currentTask) {
            let pickupCoordinates = {};
            let deliveryCoordinates = {};
    
            if (pickupAddress !== props.pickupAddress) {
                pickupCoordinates = await actions.getCoordinates(pickupAddress);
            }
    
            if (deliveryAddress !== props.deliveryAddress) {
                deliveryCoordinates = await actions.getCoordinates(deliveryAddress);
            }
    
            const { lat: pickupLat, lgt: pickupLgt } = pickupCoordinates || {};
            const { lat: deliveryLat, lgt: deliveryLgt } = deliveryCoordinates || {};
    
            actions.editTask(
                props.currentTask.id, 
                title, 
                description, 
                pickupAddress, 
                deliveryAddress, 
                dueDate, 
                category, 
                null, 
                budget, 
                deliveryLat, 
                deliveryLgt, 
                pickupLat, 
                pickupLgt
            );
        } else {
            let pickupCoordinates = null;
            let deliveryCoordinates = null;

            if(pickupAddress) pickupCoordinates = await actions.getCoordinates(pickupAddress);
            if(deliveryAddress) deliveryCoordinates = await actions.getCoordinates(deliveryAddress);
    
            if (pickupCoordinates && deliveryCoordinates) {
                const { lat: pickupLat, lgt: pickupLgt } = pickupCoordinates;
                const { lat: deliveryLat, lgt: deliveryLgt } = deliveryCoordinates;
    
                actions.addTask(
                    title, 
                    description, 
                    pickupAddress, 
                    deliveryAddress, 
                    dueDate, 
                    category, 
                    budget, 
                    deliveryLat, 
                    deliveryLgt, 
                    pickupLat, 
                    pickupLgt
                );
            } else actions.setError("Missing fields.");
        }
    };

    const handlePickupAddressChange = (newAddress) => {
        setPickupAddress(newAddress);
    };
    
    const handleDeliveryAddressChange = (newAddress) => {
        setDeliveryAddress(newAddress);
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

                <form id="task-form">
                    <label htmlFor='title'>Title</label>
                    <input type="text" className="form-control" placeholder="Title" aria-label="Title" id='title' aria-describedby="basic-addon1" value={title} onChange={(e) => setTitle(e.target.value)} />

                    <label htmlFor='category-select'>Category</label>
                    <select 
                        className="form-select select-options" 
                        aria-label="category list" 
                        id="category-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="" disabled>Choose category</option>
                        {store.categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>

                    <label htmlFor='description'>Description</label>
                    <textarea className="form-control" aria-label="description" maxLength="500" rows="5" value={description} onChange={(e) => setDescription(e.target.value)} ></textarea>
                    
                    <AddressInput label="Pickup Address" handleChange={handlePickupAddressChange} value={pickupAddress} />
                    <AddressInput label="Delivery Address" handleChange={handleDeliveryAddressChange} value={deliveryAddress} />

                    <div className='d-flex justify-content-between'>
                        <div>
                            <label htmlFor='due-date'>Due Date</label>
                            <input type="date" className="form-control" aria-label="due date" id='due-date' aria-describedby="basic-addon1" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor='budget'>Budget</label>
                            <div className='input-group'>
                                <input type="text" className="form-control" id='budget' aria-label="budget" aria-describedby="basic-addon1" value={budget} onChange={(e) => setBudget(e.target.value)} />
                                <div className="input-group-append">
                                    <span className="input-group-text" id="basic-addon2">€</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-secondary" onClick={props.handleClose}>Close</button>
                <button type="submit" form="task-form" className="btn btn-primary" onClick={(event) => handleSubmit(event)}>{`${props.currentTask ? "Save" : "Post"}`}</button>
            </Modal.Footer>
        </Modal>
    );
}

export default TaskForm;