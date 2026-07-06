import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';
import { PanelLeftClose, PanelLeftOpen, LogOut } from 'lucide-react';
import { authService } from '../../services/authService';

interface HeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard Overview';
      case '/employees':
        return 'Employee Directory';
      case '/attendance':
        return 'Attendance Tracking';
      case '/reports':
        return 'Reports & Analytics';
      case '/departments':
        return 'Departments & Structure';
      case '/roles':
        return 'Roles & Access Management';
      case '/settings':
        return 'Portal Settings';
      default:
        return 'Dashboard Overview';
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-brand-border bg-brand-bg/85 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10 transition-all duration-300">
      <div className="flex items-center gap-4">
        {/* Collapsible toggle trigger */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-brand-text hover:text-brand-heading hover:bg-brand-border/40 border border-brand-border/20 transition-all duration-300 cursor-pointer hidden sm:block"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4.5 h-4.5 text-brand-accent" />
          ) : (
            <PanelLeftClose className="w-4.5 h-4.5" />
          )}
        </button>

        <div>
          <h2 className="text-xl font-bold text-brand-heading leading-none">
            {getPageTitle(location.pathname)}
          </h2>
          <p className="text-xs text-brand-text mt-1 hidden md:block">
            Manage, analyze, and optimize your workspace.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Theme Switching Controller */}
        <ThemeToggle />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl text-brand-text hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
          title="Log Out Session"
        >
          <LogOut className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </header>
  );
};

export default Header;
