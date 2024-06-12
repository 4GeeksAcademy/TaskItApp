import React, { useState, useContext, useEffect } from 'react';
import { Modal, ModalTitle } from 'react-bootstrap';
import { Context } from '../../store/appContext.js';
import Alert from '../alert.jsx';
import StarRating from "./StarRating.jsx"

const RatingForm = (props) => {
    const { store, actions } = useContext(Context);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");

    useEffect(() => {
        resetStates();
        if (store.message) store.message = "";
    }, [props.show])

    const resetStates = () => {
        setRating(0);
        setReview('');
    }

    useEffect(() => {
        if(store.message == "User rated successfully.") {
            if (props.role == "requester") actions.getRequesterCompletedTasks();
            if (props.role == "seeker") actions.getSeekerCompletedTasks();
            props.setShowBtn(false);
            props.handleClose();
        }
    }, [store.message])

    const handleSubmit = async (event) => {
        event.preventDefault();
        const seekerID = props.role == "requester" ? props.id : null;
        const requesterID = props.role == "seeker" ? props.id : null;
        actions.addRating(rating, seekerID, requesterID, props.taskID, review);
        actions.sendNotification(`You have been rated for the task with id ${props.taskID}.`, props.username);
    };

    return (
        <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header>
                <ModalTitle>Rate and Review {props.username}</ModalTitle>
                <button className="btn close" data-dismiss="modal" aria-label="Close" onClick={props.handleClose}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </Modal.Header>
            <Modal.Body>
                {(store.message || store.error) && <Alert message={store.message} error={store.error} ></Alert>}
                
                <form id="review-form">
                    <StarRating
                        value={rating}
                        onChange={setRating}
                    />

                    <label htmlFor='review'>Review</label>
                    <textarea
                        className="form-control"
                        id="review"
                        ame="review"
                        placeholder="Tell people your experience with this user..."
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                    ></textarea>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-orange" onClick={props.handleClose}>Close</button>
                <button type="submit" form="review-form" className="btn btn-clear-yellow" onClick={(event) => handleSubmit(event)}>Review</button>
            </Modal.Footer>
        </Modal>
    );
}

export default RatingForm;