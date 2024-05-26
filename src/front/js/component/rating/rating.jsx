import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../store/appContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import StarRating from './StarRating.jsx';

const RatingPage = () => {
    const [newRatingStars, setNewRatingStars] = useState(0);
    const [newSeekerId, setNewSeekerId] = useState("");
    const [newTaskId, setNewTaskId] = useState("");
    const [ratingKey, setRatingKey] = useState(0);
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getRatings();
    }, []);

    const handleAddRating = async () => {
        const stars = parseInt(newRatingStars, 10);
        const seeker_id = parseInt(newSeekerId, 10);
        const task_id = parseInt(newTaskId, 10);

        if (!newSeekerId || !newTaskId) {
            alert("Please enter both the seeker ID and task ID.");
            return;
        }

        if (stars < 1 || stars > 5) {
            alert("Please select a rating between 1 and 5 stars.");
            return;
        }

        const seekerExists = await actions.checkSeekerExists(seeker_id);
        if (!seekerExists) {
            alert("Seeker ID does not exist.");
            return;
        }

        const taskExists = await actions.checkTaskExists(task_id);
        if (!taskExists) {
            alert("Task ID does not exist.");
            return;
        }

        actions.addRating(stars, seeker_id, task_id);
        setNewRatingStars(0);
        setNewSeekerId("");
        setNewTaskId("");
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
                    <input
                        className="form-control"
                        style={{ width: "150px" }}
                        value={newSeekerId}
                        onChange={(e) => setNewSeekerId(e.target.value)}
                        placeholder="Seeker ID"
                        type="number"
                        min="1"
                    />
                </div>
                <div className="form-group mx-sm-3 mb-2">
                    <input
                        className="form-control"
                        style={{ width: "150px" }}
                        value={newTaskId}
                        onChange={(e) => setNewTaskId(e.target.value)}
                        placeholder="Task ID"
                        type="number"
                        min="1"
                    />
                </div>
                <button type="button" className="btn btn-primary mb-2" onClick={handleAddRating}>
                    Add Rating
                </button>
            </form>
            <ul className="list-group mt-4">
                {store.ratings && store.ratings.map(rating => (
                    <li key={rating.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <StarRating value={rating.stars} />
                            <span className="ml-3">- Seeker ID: {rating.seeker_id} - Seeker Username: {rating.seeker_username} - Task ID: {rating.task_id} - Task Description: {rating.task_description}</span>
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

export default RatingPage;
