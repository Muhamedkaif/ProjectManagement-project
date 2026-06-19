import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const LayoutWrapper = ({ children, title }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-bg-sub">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'ml-[80px]' : 'ml-[260px]'}`}>
        <Navbar title={title} />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutWrapper;
