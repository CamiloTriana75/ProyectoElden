import React from 'react';
import { Home, Calendar, BarChart3, Phone, User, Settings, LogOut, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'canchas', label: 'Canchas', icon: Users },
  { id: 'reservas', label: 'Reservas', icon: Calendar },
  { id: 'reportes', label: 'Reportes', icon: BarChart3 },
  { id: 'contacto', label: 'Contacto', icon: Phone },
  { id: 'perfil', label: 'Perfil', icon: User },
  { id: 'ajustes', label: 'Ajustes', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const { logout, user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isEmployee = user?.role === 'employee';

  // Filter menu items based on user role
  let filteredMenuItems;
  if (isAdmin) {
    // Admin only sees reservations
    filteredMenuItems = menuItems.filter(item => item.id === 'reservas');
  } else if (isEmployee) {
    // Employee sees home, reservations, reports, contact, and settings
    filteredMenuItems = menuItems.filter(item => 
      ['inicio', 'reservas', 'reportes', 'contacto', 'ajustes'].includes(item.id)
    );
  } else {
    // Regular users see everything except reports
    filteredMenuItems = menuItems.filter(item => item.id !== 'reportes');
  }

  return (
    <div className="w-64 bg-gray-900/95 backdrop-blur-sm h-screen p-4 flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
          <div className="text-white font-bold text-xl">⚽</div>
        </div>
        <div className="text-white">
          <h1 className="font-bold text-lg">Campos Deportivos</h1>
          <p className="text-green-400 text-sm">Elden</p>
        </div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">
                    {isAdmin && item.id === 'reservas' ? 'Gestión de Reservas' : item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Cerrar Sesión</span>
      </button>
    </div>
  );
};