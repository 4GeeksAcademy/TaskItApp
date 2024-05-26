import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../../store/appContext.js';

const SeekerForm = (props) => {
    const { actions } = useContext(Context);

    const [userID, setUserID] = useState("");
    const [overallRating, setOverallRating] = useState("");
    const [totalReviews, setTotalReviews] = useState("");
    const [totalCompletedTasks, setTotalCompletedTasks] = useState("");
    const [averageBudget, setAverageBudget] = useState("");

    useEffect(() => {
        if (props.currentSeeker) {
            setOverallRating(props.currentSeeker.overall_rating);
            setTotalReviews(props.currentSeeker.total_reviews);
            setTotalCompletedTasks(props.currentSeeker.total_completed_tasks);
            setAverageBudget(props.currentSeeker.average_budget);
        }
    }, [props.currentSeeker]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (props.currentSeeker) {
            actions.editSeeker(props.currentSeeker.id, overallRating, totalReviews, totalCompletedTasks, averageBudget);
        } else {
            actions.addSeeker(userID);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {props.currentSeeker ? (
                <>
                    <label htmlFor='overallRating'>Overall Rating</label>
                    <input type="text" className="form-control" placeholder="Overall Rating" id='overallRating' value={overallRating} onChange={(e) => setOverallRating(e.target.value)} />

                    <label htmlFor='totalReviews'>Total Reviews</label>
                    <input type="text" className="form-control" placeholder="Total Reviews" id='totalReviews' value={totalReviews} onChange={(e) => setTotalReviews(e.target.value)} />

                    <label htmlFor='totalCompletedTasks'>Total Completed Tasks</label>
                    <input type="text" className="form-control" placeholder="Total Completed Tasks" id='totalCompletedTasks' value={totalCompletedTasks} onChange={(e) => setTotalCompletedTasks(e.target.value)} />

                    <button type="button" className="btn btn-secondary" onClick={props.handleClose}>Close</button>
                    <button type="submit" className="btn btn-primary">Save</button>
                </>
            ) : (
                <>
                    <label htmlFor='userID'>User ID</label>
                    <input type="text" className="form-control" placeholder="User ID" value={userID} onChange={(e) => setUserID(e.target.value)} />
                    <button type="submit" className="btn btn-primary">Post</button>
                </>
            )}
        </form>
    );
}

export default SeekerForm;