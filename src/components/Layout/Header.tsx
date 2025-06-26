import React from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Campos Deportivos Elden</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white">
            <User className="w-5 h-5" />
            <span className="text-sm"></span>
            <span className="text-gray-400"></span>
            <span className="text-sm"></span>
          </div>
        </div>
      </div>
    </header>
  );
};