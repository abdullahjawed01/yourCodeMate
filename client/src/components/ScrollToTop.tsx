import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Check if the scroll container exists (the main tag in Layout.tsx)
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.scrollTo(0, 0);
        } else {
            window.scrollTo(0, 0);
        }
    }, [pathname]);

    return null;
}
