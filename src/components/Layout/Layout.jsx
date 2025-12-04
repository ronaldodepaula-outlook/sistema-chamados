import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = () => {
  // Initialize sidebar visibility from localStorage when available.
  // Fall back to opening the sidebar on larger screens (md and up).
  const getInitialSidebarOpen = () => {
    try {
      const stored = localStorage.getItem('sidebarOpen');
      if (stored !== null) return JSON.parse(stored);
    } catch {
      // Ignore storage issues and fall back to media query
    }

    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(min-width: 768px)').matches;
    }
    return false;
  };

  const [sidebarOpen, setSidebarOpen] = useState(() => getInitialSidebarOpen());
  React.useEffect(() => {
    const onClose = () => setSidebarOpen(false);
    window.addEventListener('sidebar:close', onClose);
    return () => window.removeEventListener('sidebar:close', onClose);
  }, []);

  // Persist sidebar state so it survives page refreshes.
  React.useEffect(() => {
    try {
      localStorage.setItem('sidebarOpen', JSON.stringify(Boolean(sidebarOpen)));
    } catch {
      // Ignore storage errors in restricted environments
    }
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar: hidden on small screens unless opened */}
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={() => setSidebarOpen((s) => !s)} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;