import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Sport } from '../../types';

interface SportSelectionProps {
  onSportSelect: (sport: Sport) => void;
}

export const SportSelection: React.FC<SportSelectionProps> = ({ onSportSelect }) => {
  const { sports } = useData();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Seleccionar Deporte</h1>
        <p className="text-xl text-green-300">
          Elige el deporte para ver las canchas disponibles
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sports.map((sport, index) => (
          <div
            key={sport.id}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
            onClick={() => onSportSelect(sport)}
          >
            <div className="flex items-center gap-6">
              <div className="text-left">
                
              </div>
              
              <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                {sport.icon}
              </div>
              
              <div className="bg-gray-700/50 px-8 py-4 rounded-lg flex-1">
                <h3 className="text-2xl font-bold text-white group-hover:text-green-300 transition-colors">
                  {sport.name}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};