
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HeaderProps {
  activeTab: 'portfolio' | 'cash';
}

const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  return (
    <header className="pt-8 pb-4 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Link 
          to="/portfolio" 
          className={cn(
            "text-3xl font-bold", 
            activeTab === 'portfolio' ? 'text-black' : 'text-tr-gray'
          )}
        >
          Wealth
        </Link>
        <Link 
          to="/cash" 
          className={cn(
            "text-3xl font-bold",
            activeTab === 'cash' ? 'text-black' : 'text-tr-gray'
          )}
        >
          Cash
        </Link>
      </div>
      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
        K
      </div>
    </header>
  );
};

export default Header;
