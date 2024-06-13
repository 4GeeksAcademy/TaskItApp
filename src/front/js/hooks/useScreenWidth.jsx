import { useState, useEffect } from 'react';

function useScreenWidth() {
    const [isScreenWidthBelow820, setIsScreenWidthBelow820] = useState(window.innerWidth <= 820);

    useEffect(() => {
        const handleResize = () => {
            setIsScreenWidthBelow820(window.innerWidth <= 820);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return isScreenWidthBelow820;
}

export default useScreenWidth;