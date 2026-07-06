import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Award,
  CalendarCheck,
  BarChart4,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5 shrink-0" /> },
    { id: 'employees', label: 'Employees', path: '/employees', icon: <Users className="w-5 h-5 shrink-0" /> },
    { id: 'attendance', label: 'Attendance', path: '/attendance', icon: <CalendarCheck className="w-5 h-5 shrink-0" /> },
    { id: 'reports', label: 'Reports & Analytics', path: '/reports', icon: <BarChart4 className="w-5 h-5 shrink-0" /> },
  ];

  return (
    <aside
      className={`bg-brand-bg border-r border-brand-border flex flex-col h-full transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
        }`}
    >
      {/* Brand Logo Header */}
      <div className={`h-16 flex items-center px-4 border-b border-brand-border ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center text-white shrink-0 shadow-md shadow-brand-accent/25">
            <Award className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="transition-opacity duration-300">
              <h1 className="text-base font-bold text-brand-heading tracking-tight leading-none">EMS Portal</h1>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${isCollapsed ? 'justify-center' : ''
                } ${isActive
                  ? 'bg-brand-accent-bg text-brand-accent border-l-1 border-brand-accent shadow-sm'
                  : 'text-brand-text hover:text-brand-heading hover:bg-brand-border/30 border-l-1 border-transparent'
                }`}
              title={isCollapsed ? item.label : undefined}
            >
              {item.icon}
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="p-4">

        {isCollapsed ? (
          <div className="text-[9px] text-brand-text/40 font-medium mt-1 text-center">
            v1.0
          </div>
        ) : (
          <div className="text-[10px] text-brand-text/50 font-medium uppercase tracking-wider mt-1 text-center  pt-2">
            Enterprise v1.0
          </div>
        )}
      </div>
      {/* Footer Info & Enterprise version */}
      <div className="p-4 border-t border-brand-border bg-brand-code/30">
        <div className="flex flex-col gap-2 overflow-hidden">
          <div className="flex items-center gap-3">
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


        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
