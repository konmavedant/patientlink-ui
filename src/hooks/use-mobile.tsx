
import { useState, useEffect } from 'react';

// Custom hook to detect if the device is mobile based on screen width
export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIsMobile();

    // Add resize event listener
    window.addEventListener('resize', checkIsMobile);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
};

// Export an alias for consistency with errors
export const useIsMobile = useMobile;
