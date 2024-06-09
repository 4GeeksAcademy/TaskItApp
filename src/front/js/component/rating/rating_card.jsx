import React from "react";
import StarRating from "./StarRating.jsx"

const RatingCard = ({ rating }) => {
    return (
        <div className="col-lg-4 col-md-8 col-sm-11 p-2 d-flex flex-column">
            <div className={`card p-4 h-100 flex-grow-1`}>
                <StarRating value={rating.stars} />
                <p>{rating.review}</p>
            </div>
        </div>
    );
}

export default RatingCard