// hooks/useWindowSize.ts
"use client"

import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    if (typeof window !== 'undefined') {
      // Initialize size
      handleResize();
      // Add event listener
      window.addEventListener('resize', handleResize);
      // Clean up
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return windowSize;
}