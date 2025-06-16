import React from 'react';
import TabNavigation from './TabNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-screen bg-gray-50">
      {/* Tab Navigation - Now at the very top */}
      <TabNavigation />

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout; 