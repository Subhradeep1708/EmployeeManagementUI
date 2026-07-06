import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  ShieldAlert,
  Award,
  PanelLeftClose,
  PanelLeftOpen,
  CalendarCheck,
  BarChart4,
  LogOut,
} from 'lucide-react';
import { authService } from '../../services/authService';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5 shrink-0" /> },
    { id: 'employees', label: 'Employees', path: '/employees', icon: <Users className="w-5 h-5 shrink-0" /> },
    { id: 'attendance', label: 'Attendance', path: '/attendance', icon: <CalendarCheck className="w-5 h-5 shrink-0" /> },
    { id: 'reports', label: 'Reports & Analytics', path: '/reports', icon: <BarChart4 className="w-5 h-5 shrink-0" /> },
    // { id: 'departments', label: 'Departments', path: '/departments', icon: <Building2 className="w-5 h-5 shrink-0" /> },
    // { id: 'roles', label: 'Roles & Access', path: '/roles', icon: <ShieldAlert className="w-5 h-5 shrink-0" /> },
    // { id: 'settings', label: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5 shrink-0" /> },
  ];

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <aside
      className={`bg-brand-bg border-r border-brand-border flex flex-col h-full transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Logo Header */}
      <div className={`h-16 flex items-center justify-between px-4 border-b border-brand-border ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center text-white shrink-0 shadow-md shadow-brand-accent/25">
            <Award className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="transition-opacity duration-300">
              <h1 className="text-base font-bold text-brand-heading tracking-tight leading-none">EMS Portal</h1>
              <span className="text-[10px] text-brand-text font-medium uppercase tracking-wider">Enterprise v1.0</span>
            </div>
          )}
        </div>

        {/* Collapsible toggle trigger */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 rounded-lg text-brand-text hover:text-brand-heading hover:bg-brand-border/40 border border-brand-border/20 transition-all duration-300 cursor-pointer hidden sm:block ${
            isCollapsed ? 'mx-auto' : ''
          }`}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-brand-accent" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                isCollapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-brand-accent-bg text-brand-accent border-l-4 border-brand-accent shadow-sm'
                  : 'text-brand-text hover:text-brand-heading hover:bg-brand-border/30 border-l-4 border-transparent'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              {item.icon}
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info & Logout */}
      <div className="p-4 border-t border-brand-border bg-brand-code/30">
        <div className={`flex items-center justify-between gap-3 overflow-hidden ${isCollapsed ? 'flex-col gap-4' : ''}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-brand-accent-bg border border-brand-accent-border flex items-center justify-center font-bold text-brand-accent shrink-0 text-sm">
              AD
            </div>
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden transition-opacity duration-300">
                <h4 className="text-xs font-semibold text-brand-heading truncate">Admin User</h4>
                <p className="text-[10px] text-brand-text truncate">admin@ems.com</p>
              </div>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            className={`p-2 rounded-xl text-brand-text hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 cursor-pointer`}
            title="Log Out Session"
          >
            <LogOut className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
