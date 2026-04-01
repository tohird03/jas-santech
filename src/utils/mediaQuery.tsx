import {useEffect, useState} from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQueryList.addListener(handleMediaQueryChange);

    return () => {
      mediaQueryList.removeListener(handleMediaQueryChange);
    };
  }, [query]);

  return matches;
};
