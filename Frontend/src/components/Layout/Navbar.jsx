import React from 'react';
import { Bell, PlusCircle, HelpCircle, Search, User } from 'lucide-react';

const Navbar = ({ title }) => {
  return (
    <header className="h-16 w-full bg-white border-b border-border px-8 flex items-center justify-between sticky top-0 z-90">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 bg-bg-sub border border-border rounded-sm px-4 py-2 text-text-muted w-[300px] cursor-pointer hover:bg-bg-accent hover:border-border-hover transition-all">
          <Search size={20} />
          <span className="text-[13px] flex-1">Search for anything...</span>
          <kbd className="text-[12px] bg-white border border-border px-1.5 py-0.5 rounded"> / </kbd>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-10 h-10 flex items-center justify-center text-text-sub rounded-sm hover:bg-bg-accent hover:text-text-main transition-all">
            <HelpCircle size={20} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-text-sub rounded-sm hover:bg-bg-accent hover:text-text-main transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-danger border-2 border-white rounded-full"></span>
          </button>
          <div className="w-px h-6 bg-border mx-2"></div>
          <button className="bg-primary text-white px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2 hover:bg-primary-hover transition-all">
            <PlusCircle size={18} />
            <span>New Project</span>
          </button>
          <div className="ml-2">
            <div className="w-9 h-9 bg-bg-accent rounded-full flex items-center justify-center text-text-sub border border-border cursor-pointer overflow-hidden">
              <User size={20} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
