"use client"

import { ReactNode } from 'react';
import { LayoutProvider } from '../contexts/LayoutContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <LayoutProvider>
      {children}
    </LayoutProvider>
  );
}