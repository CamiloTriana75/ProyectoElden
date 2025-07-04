import React, { useState } from 'react';
import { Users, Briefcase, FileText, CreditCard, Trophy, Building, Clock, Database, UserCheck } from 'lucide-react';

interface AdminSettingsProps {
  onSectionSelect: (section: string) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ onSectionSelect }) => {
  const adminSections = [
    { 
      id: 'employees', 
      label: 'Empleado', 
      icon: Users, 
      number: '6.1',
      description: 'Gestionar empleados del sistema'
    },
    { 
      id: 'clients', 
      label: 'Clientes', 
      icon: UserCheck, 
      number: '6.2',
      description: 'Ver clientes registrados y estadísticas'
    },
    { 
      id: 'positions', 
      label: 'Cargo', 
      icon: Briefcase, 
      number: '6.3',
      description: 'Administrar cargos y roles'
    },
    { 
      id: 'sports', 
      label: 'Deportes', 
      icon: Trophy, 
      number: '6.4',
      description: 'Configurar deportes disponibles'
    },
    { 
      id: 'document-types', 
      label: 'Tipo de Documento', 
      icon: FileText, 
      number: '6.5',
      description: 'Tipos de documentos de identidad'
    },
    
    { 
      id: 'fields', 
      label: 'Canchas', 
      icon: Building, 
      number: '6.6',
      description: 'Administrar canchas deportivas'
    },
    { 
      id: 'time-slots', 
      label: 'Horarios', 
      icon: Clock, 
      number: '6.7',
      description: 'Configurar horarios de las canchas'
    },
    { 
      id: 'database', 
      label: 'Base de Datos', 
      icon: Database, 
      number: '6.8',
      description: 'Administrar y reinicializar la base de datos'
    }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Ajustes</h1>
        <p className="text-xl text-green-300">
          Panel de administración del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {adminSections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
              onClick={() => onSectionSelect(section.id)}
            >
              <div className="flex items-center gap-6">
                <div className="text-left">
                </div>
                
                <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-16 h-16 text-green-400" />
                </div>
                
                <div className="bg-gray-700/50 px-8 py-4 rounded-lg flex-1">
                  <h3 className="text-2xl font-bold text-white group-hover:text-green-300 transition-colors">
                    {section.label}
                  </h3>
                  <p className="text-gray-300 text-sm mt-2">
                    {section.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};