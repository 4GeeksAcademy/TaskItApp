import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../../store/appContext.js';

const RequesterForm = (props) => {
    const { actions } = useContext(Context);

    const [userID, setUserID] = useState("");
    const [overallRating, setOverallRating] = useState("");
    const [totalReviews, setTotalReviews] = useState("");
    const [totalRequestedTasks, setTotalRequestedTasks] = useState("");
    const [averageBudget, setAverageBudget] = useState("");

    useEffect(() => {
        if (props.currentRequester) {
            setOverallRating(props.currentRequester.overall_rating);
            setTotalReviews(props.currentRequester.total_reviews);
            setTotalRequestedTasks(props.currentRequester.total_requested_tasks);
            setAverageBudget(props.currentRequester.average_budget);
        }
    }, [props.currentRequester]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (props.currentRequester) {
            actions.editRequester(props.currentRequester.id, overallRating, totalReviews, totalRequestedTasks, averageBudget);
        } else {
            actions.addRequester(userID);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {props.currentRequester ? (
                <>
                    <label htmlFor='overallRating'>Overall Rating</label>
                    <input type="text" className="form-control" placeholder="Overall Rating" id='overallRating' value={overallRating} onChange={(e) => setOverallRating(e.target.value)} />

                    <label htmlFor='totalReviews'>Total Reviews</label>
                    <input type="text" className="form-control" placeholder="Total Reviews" id='totalReviews' value={totalReviews} onChange={(e) => setTotalReviews(e.target.value)} />

                    <label htmlFor='totalRequestedTasks'>Total Requested Tasks</label>
                    <input type="text" className="form-control" placeholder="Total Requested Tasks" id='totalRequestedTasks' value={totalRequestedTasks} onChange={(e) => setTotalRequestedTasks(e.target.value)} />

                    <label htmlFor='averageBudget'>Average Budget</label>
                    <input type="text" className="form-control" placeholder="Average Budget" id='averageBudget' value={averageBudget} onChange={(e) => setAverageBudget(e.target.value)} />

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

export default RequesterForm;