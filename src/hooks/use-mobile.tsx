
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => {
      setMatches(media.matches);
    };
    
    // Use addEventListener with a modern approach
    media.addEventListener('change', listener);
    
    // Check on mount (callback is not called until a change occurs)
    setMatches(media.matches);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}
