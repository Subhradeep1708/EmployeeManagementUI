import React from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';
import { Search, Bell, HelpCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard Overview';
      case '/employees':
        return 'Employee Directory';
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

  return (
    <header className="h-16 border-b border-brand-border bg-brand-bg/85 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10 transition-all duration-300">
      <div>
        <h2 className="text-xl font-bold text-brand-heading leading-none">
          {getPageTitle(location.pathname)}
        </h2>
        <p className="text-xs text-brand-text mt-1 hidden md:block">
          Manage, analyze, and optimize your workspace.
        </p>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative w-64 hidden lg:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-brand-text/60">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search employees, documents..."
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl bg-brand-code border border-brand-border text-brand-heading focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-200"
          />
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl text-brand-text hover:text-brand-heading hover:bg-brand-border/40 transition-all duration-200 relative cursor-pointer">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          </button>
          <button className="p-2 rounded-xl text-brand-text hover:text-brand-heading hover:bg-brand-border/40 transition-all duration-200 cursor-pointer">
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6 w-px bg-brand-border"></div>

        {/* Theme Switching Controller */}
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
