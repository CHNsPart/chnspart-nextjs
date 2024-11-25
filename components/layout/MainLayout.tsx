// components/layout/MainLayout.tsx
"use client"

import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { ReactNode } from 'react';
import { useLayout } from '@/app/contexts/LayoutContext';
import { PageTransition } from '../shared/PageTransition';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { isDesktop } = useLayout();

  return (
    <main className={`
      mx-[15px] mb-[75px] min-w-[259px]
      md:mx-auto md:mt-[60px] md:mb-[100px]
      xl:max-w-[1200px] xl:flex xl:justify-center xl:items-stretch xl:gap-6
    `}>
      <Sidebar />
      <div className={`
        main-content relative 
        ${isDesktop ? 'min-w-[75%] w-[75%]' : 'w-full'}
        m-0
      `}>
        <PageTransition>
          <Navbar />
          {children}
        </PageTransition>
      </div>
    </main>
  );
}