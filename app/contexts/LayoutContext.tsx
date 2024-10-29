// app/contexts/LayoutContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWindowSize } from '@/app/hooks/useWindowSize';

interface LayoutContextType {
  isSidebarExpanded: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
  isTablet: boolean;
  isLaptop: boolean;
  isDesktop: boolean;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  // Initialize with mobile defaults (will be updated on mount)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { width } = useWindowSize();

  const breakpoints = {
    isMobile: width < 580,
    isTablet: width >= 580 && width < 1024,
    isLaptop: width >= 1024 && width < 1250,
    isDesktop: width >= 1250
  };

  useEffect(() => {
    setMounted(true);
    if (width >= 1024) {
      setIsSidebarExpanded(true);
    }
  }, [width]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Prevent hydration mismatch by returning consistent initial state
  if (!mounted) {
    return (
      <LayoutContext.Provider value={{
        isSidebarExpanded: false,
        toggleSidebar: () => {},
        isMobile: true,
        isTablet: false,
        isLaptop: false,
        isDesktop: false
      }}>
        {children}
      </LayoutContext.Provider>
    );
  }

  return (
    <LayoutContext.Provider value={{
      isSidebarExpanded,
      toggleSidebar,
      ...breakpoints
    }}>
      {children}
    </LayoutContext.Provider>
  );
}

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};