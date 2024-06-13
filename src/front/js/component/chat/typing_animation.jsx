import React, { useState, useEffect } from 'react';

const TypingAnimation = () => {
    const [typingAnimation, setTypingAnimation] = useState('.');

    useEffect(() => {
        const interval = setInterval(() => {
            setTypingAnimation((prevAnimation) => {
                if (prevAnimation === '...') {
                    return '.';
                } else {
                    return prevAnimation + '.';
                }
            });
        }, 250); 

        return () => clearInterval(interval);
    }, []);

    return <>{typingAnimation}</>;
};

export default TypingAnimation;