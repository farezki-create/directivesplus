
import React from 'react';
import AppNavigation from '../AppNavigation';
import AppFooter from '../AppFooter';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const AppLayout = ({ children, className = "" }: AppLayoutProps) => {
  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${className}`}>
      <AppNavigation />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <AppFooter />
    </div>
  );
};

export default AppLayout;
