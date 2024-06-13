import React from "react";
import StarRating from "./StarRating.jsx";
import { useLocation } from "react-router-dom";

const RatingCard = ({ rating }) => {
    const path = useLocation().pathname;
    const isTaskDetailPage = /^\/tasks\/\d+$/.test(path);

    return (
        <div className="container-fluid">
            <div className={`${isTaskDetailPage ? "col-12" : "col-lg-4 col-md-8 col-sm-11 flex-column"} p-0 d-flex w-100 h-100`}>
                <div className={`card p-4 h-100 ${isTaskDetailPage ? "w-100" : ""} `}>
                    <StarRating value={rating.stars || 0} />
                    <p>{rating.review}</p>
                </div>
            </div>
        </div>
    );
}

export default RatingCard;