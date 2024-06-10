import { useState, useEffect } from 'react';

function useScreenWidth() {
    const [isScreenWidthBelow760, setIsScreenWidthBelow760] = useState(window.innerWidth <= 760);

    useEffect(() => {
        const handleResize = () => {
            setIsScreenWidthBelow760(window.innerWidth <= 760);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return isScreenWidthBelow760;
}

export default useScreenWidth;