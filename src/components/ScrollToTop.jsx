import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // 1. Reset window scroll
        window.scrollTo(0, 0);

        // 2. Reset Dashboard scroll container if it exists
        const scrollContainer = document.querySelector('.content-scrollable');
        if (scrollContainer) {
            scrollContainer.scrollTo(0, 0);
        }
    }, [pathname]);

    return null;
};

export default ScrollToTop;
