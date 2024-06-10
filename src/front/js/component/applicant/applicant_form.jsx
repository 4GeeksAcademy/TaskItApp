import React, { useState, useContext, useEffect } from 'react';
import { Modal, ModalTitle } from 'react-bootstrap';
import { Context } from '../../store/appContext.js';
import Alert from '../alert.jsx';

const ApplicantForm = (props) => {
    const { store, actions } = useContext(Context);
    const [price, setPrice] = useState(0);

    useEffect(() => {
        resetStates();
    }, [props.show])

    useEffect(() => {
        if(store.message == "Applied successfully." && props.show) {
            actions.resetMessages();
            props.setApplied(true);            
            props.handleClose();
            actions.sendNotification(`You have successfuly applied to the task with ID: ${props.taskID}.`, store.user.username);
            actions.sendNotification(`${store.user.username} applied to your task with ID: ${props.taskID}`, props.taskRequester);
        }
    }, [store.message])

    const resetStates = () => {
        setPrice(0);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        actions.addPostulant(props.taskID, store.user.seeker.id, price);
    };

    return (
        <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header>
                <ModalTitle>Application Information</ModalTitle>
                <button className="btn close" data-dismiss="modal" aria-label="Close" onClick={props.handleClose}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </Modal.Header>
            <Modal.Body>
                {(store.message || store.error) && <Alert message={store.message} error={store.error} ></Alert>}

                <form id="applicant-form">
                    <label htmlFor='price'>Price</label>
                    <input type="text" className="form-control" placeholder="price" aria-label="price" id='price' aria-describedby="basic-addon1" value={price} onChange={(e) => setPrice(e.target.value)} />
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-secondary" onClick={props.handleClose}>Close</button>
                <button type="submit" form="applicant-form" className="btn btn-primary" onClick={(event) => handleSubmit(event)}>Apply</button>
            </Modal.Footer>
        </Modal>
    );
}

export default ApplicantForm;