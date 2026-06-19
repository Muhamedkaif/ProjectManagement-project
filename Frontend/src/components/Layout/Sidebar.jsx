import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare, 
  Calendar, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Search,
  LogOut
} from 'lucide-react';
import { useUser } from '../../context/UserContext';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const { user, logout: setUserLogout } = useUser();

  const handleSignOut = () => {
    localStorage.removeItem('pf_token');
    sessionStorage.removeItem('pf_token');
    setUserLogout();
    navigate('/login');
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Briefcase size={20} />, label: 'Projects', path: '/projects' },
    { icon: <CheckSquare size={20} />, label: 'Tasks', path: '/tasks' },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-white border-r border-border flex flex-col transition-all duration-300 z-[100] ${collapsed ? 'w-[80px]' : 'w-[260px]'}`}>
      <div className="h-16 flex items-center px-6 gap-3">
        <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold font-outfit flex-shrink-0">
          {user?.name?.charAt(0).toUpperCase() || 'N'}
        </div>
        {!collapsed && <span className="text-xl font-bold font-outfit tracking-tight">{user?.name || 'Nexus'}</span>}
      </div>

      <div className="px-6 py-4">
        <div className="bg-bg-sub border border-border rounded-sm px-3 py-2 flex items-center gap-2 text-text-muted">
          <Search size={18} />
          {!collapsed && <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none w-full text-sm text-text-main" />}
        </div>
      </div>

      <nav className="flex-1 px-4 flex flex-col gap-1">
        {menuItems.map((item, index) => (
          <NavLink 
            key={index} 
            to={item.path} 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-sm transition-all whitespace-nowrap ${isActive ? 'bg-primary-light text-primary font-medium' : 'text-text-sub hover:bg-bg-accent hover:text-text-main'} ${collapsed ? 'justify-center px-0' : ''}`}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="h-px bg-border mx-6 my-4"></div>

      {!collapsed && user && (
        <div className="px-4 pb-4 mb-2 border-b border-border">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold flex-shrink-0">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-main truncate">{user.name}</p>
              <p className="text-xs text-text-muted truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 flex flex-col gap-1">
        <NavLink to="/settings" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-sm transition-all whitespace-nowrap ${isActive ? 'bg-primary-light text-primary font-medium' : 'text-text-sub hover:bg-bg-accent hover:text-text-main'} ${collapsed ? 'justify-center px-0' : ''}`}>
          <Settings size={20} />
          {!collapsed && <span>Settings</span>}
        </NavLink>
        <button 
          className={`flex items-center gap-3 px-4 py-3 text-text-muted transition-all whitespace-nowrap hover:text-text-main ${collapsed ? 'justify-center px-0' : ''}`} 
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span>Collapse</span>}
        </button>
        <button
          onClick={handleSignOut}
          className={`flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-all whitespace-nowrap w-full ${collapsed ? 'justify-center px-0' : ''}`}
        >
          <LogOut size={18} />
          {!collapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>

      {!collapsed && (
        <div className="m-6 p-5 bg-primary-light rounded-lg text-center">
          <p className="text-xs text-primary mb-3 font-medium">You're on Free plan</p>
          <button className="bg-primary text-white px-4 py-2 rounded-sm font-medium transition-all hover:bg-primary-hover hover:shadow-lg w-full text-[13px] justify-center flex items-center gap-2">Upgrade to Pro</button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
