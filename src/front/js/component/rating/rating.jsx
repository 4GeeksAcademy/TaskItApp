import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../store/appContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import StarRating from './StarRating.jsx';

const Rating = () => {
    const [newRatingStars, setNewRatingStars] = useState(0);
    const [newSeekerId, setNewSeekerId] = useState("");
    const [newRequesterId, setNewRequesterId] = useState("");
    const [newTaskId, setNewTaskId] = useState("");
    const [newReview, setNewReview] = useState("");
    const [ratingKey, setRatingKey] = useState(0);
    const { store, actions } = useContext(Context);

    useEffect(() => {
        if (actions) {
            actions.getRatings();
            actions.getSeekers();
            actions.getRequesters();
            actions.getTasks();
        } else {
            console.error("actions is not defined");
        }
    }, []); // Dependencias vacías para asegurarnos de que solo se ejecute una vez al montar el componente

    const handleAddRating = async () => {
        const stars = parseInt(newRatingStars, 10);
        const seeker_id = newSeekerId ? parseInt(newSeekerId, 10) : null;
        const requester_id = newRequesterId ? parseInt(newRequesterId, 10) : null;
        const task_id = parseInt(newTaskId, 10);

        if (!newTaskId || (!newSeekerId && !newRequesterId) || (newSeekerId && newRequesterId)) {
            alert("Please enter valid Seeker ID or Requester ID, and Task ID.");
            return;
        }

        if (stars < 1 || stars > 5) {
            alert("Please select a rating between 1 and 5 stars.");
            return;
        }

        if (seeker_id) {
            const seekerExists = await actions.checkSeekerExists(seeker_id);
            if (!seekerExists) {
                alert("Seeker ID does not exist.");
                return;
            }
        }

        if (requester_id) {
            const requesterExists = await actions.checkRequesterExists(requester_id); 
            if (!requesterExists) {
                alert("Requester ID does not exist.");
                return;
            }
        }

        actions.addRating(stars, seeker_id, requester_id, task_id, newReview);
        setNewRatingStars(0);
        setNewSeekerId("");
        setNewRequesterId("");
        setNewTaskId("");
        setNewReview("");
        setRatingKey(prevKey => prevKey + 1);
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Add a New Rating</h2>
            <form className="form-inline">
                <div className="form-group mb-2">
                    <StarRating
                        key={ratingKey}
                        value={newRatingStars}
                        onChange={setNewRatingStars}
                    />
                </div>
                <div className="form-group mx-sm-3 mb-2">
                    <select
                        className="form-control"
                        value={newSeekerId}
                        onChange={(e) => setNewSeekerId(e.target.value)}
                        disabled={!!newRequesterId}
                    >
                        <option value="">Select Seeker ID</option>
                        {store.seekers.map(seeker => (
                            <option key={seeker.id} value={seeker.id}>
                                {seeker.user && seeker.user.username ? `${seeker.user.username} (ID: ${seeker.id})` : `ID: ${seeker.id}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group mx-sm-3 mb-2">
                    <select
                        className="form-control"
                        value={newRequesterId}
                        onChange={(e) => setNewRequesterId(e.target.value)}
                        disabled={!!newSeekerId}
                    >
                        <option value="">Select Requester ID</option>
                        {store.requesters.map(requester => (
                            <option key={requester.id} value={requester.id}>
                                {requester.user && requester.user.username ? `${requester.user.username} (ID: ${requester.id})` : `ID: ${requester.id}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group mx-sm-3 mb-2">
                    <select
                        className="form-control"
                        value={newTaskId}
                        onChange={(e) => setNewTaskId(e.target.value)}
                    >
                        <option value="">Select Task ID</option>
                        {store.tasks.map(task => (
                            <option key={task.id} value={task.id}>
                                {task.title} (ID: {task.id})
                            </option>
                        ))}
                    </select>
                </div>
                <label htmlFor='review'>Review</label>
                <input type="text" className="form-control" placeholder="review" id='review' value={newReview} onChange={(e) => setNewReview(e.target.value)} />
                <button type="button" className="btn btn-primary mb-2" onClick={handleAddRating}>
                    Add Rating
                </button>
            </form>
            <ul className="list-group mt-4">
                {store.ratings && store.ratings.map(rating => (
                    <li key={rating.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <StarRating value={rating.stars} />
                            <span className="ml-3">
                                {rating.seeker_id ? `Seeker ID: ${rating.seeker_id} - Seeker Username: ${rating.seeker_username || 'N/A'}` : ''}
                                {rating.requester_id ? `Requester ID: ${rating.requester_id} - Requester Username: ${rating.requester_username || 'N/A'}` : ''}
                                - Task ID: {rating.task_id} - Task: {rating.task_title || 'N/A'}
                                - Review {rating.review}
                            </span>
                        </div>
                        <div>
                            <button className="btn btn-danger btn-sm mr-2" onClick={() => actions.deleteRating(rating.id)}>
                                Delete
                            </button>
                            <button className="btn btn-success btn-sm" onClick={() => {
                                const newStars = prompt("New stars:", rating.stars);
                                if (newStars > 0 && newStars <= 5) {
                                    actions.editRating(rating.id, parseInt(newStars, 10));
                                } else {
                                    alert("Please enter a rating between 1 and 5 stars.");
                                }
                            }}>
                                Edit
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Rating;
