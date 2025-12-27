/**
 * Safari-specific fixes and utilities
 */

// Fix for Safari viewport height
export const fixSafariViewport = () => {
  if (typeof window !== 'undefined') {
    const fixPositioning = () => {
      // Force everything to top
      document.documentElement.style.marginTop = '0px';
      document.documentElement.style.paddingTop = '0px';
      document.documentElement.style.top = '0px';
      document.documentElement.style.position = 'fixed';

      document.body.style.marginTop = '0px';
      document.body.style.paddingTop = '0px';
      document.body.style.top = '0px';
      document.body.style.position = 'fixed';
      document.body.style.height = '100vh';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      const root = document.getElementById('root');
      if (root) {
        root.style.marginTop = '0px';
        root.style.paddingTop = '0px';
        root.style.top = '0px';
        root.style.position = 'fixed';
        root.style.height = '100vh';
        root.style.width = '100%';
        root.style.overflow = 'hidden';
      }

      // Scroll to top
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    fixPositioning();

    // Fix on resize and orientation change
    window.addEventListener('resize', fixPositioning);
    window.addEventListener('orientationchange', fixPositioning);

    // Fix on load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fixPositioning);
    } else {
      fixPositioning();
    }

    // Also fix after a short delay to catch any late rendering
    setTimeout(fixPositioning, 100);
    setTimeout(fixPositioning, 500);

    return () => {
      window.removeEventListener('resize', fixPositioning);
      window.removeEventListener('orientationchange', fixPositioning);
    };
  }
};

// Detect Safari
export const isSafari = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

// Fix for Safari input focus
export const fixSafariInputFocus = (element: HTMLElement) => {
  if (isSafari()) {
    element.style.transform = 'translateZ(0)';
    element.style.webkitTransform = 'translateZ(0)';
  }
};

// Fix for Safari scroll
export const enableSafariSmoothScroll = () => {
  if (isSafari() && typeof document !== 'undefined') {
    // @ts-ignore
    document.documentElement.style.webkitOverflowScrolling = 'touch';
  }
};

