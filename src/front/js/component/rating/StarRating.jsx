import React from 'react';
import ReactStars from 'react-rating-stars-component';

const StarRating = ({ value, onChange }) => {
    return (
        <ReactStars
            count={5}
            value={value}
            onChange={onChange}
            size={24}
            activeColor="#ffd700"
            edit={typeof onChange === 'function'}
        />
    );
};

export default StarRating;
