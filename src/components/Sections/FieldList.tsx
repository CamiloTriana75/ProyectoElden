import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Field, Sport } from '../../types';
import { useData } from '../../contexts/DataContext';

interface FieldListProps {
  sport: Sport;
  onFieldSelect: (field: Field) => void;
  onBack: () => void;
}

export const FieldList: React.FC<FieldListProps> = ({ sport, onFieldSelect, onBack }) => {
  const { fields } = useData();
  const sportFields = fields.filter(field => field.sportId === sport.id);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
        <h1 className="text-4xl font-bold text-white">Canchas {sport.name}</h1>
      </div>

      {sportFields.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">{sport.icon}</div>
          <h3 className="text-2xl font-bold text-white mb-2">No hay canchas disponibles</h3>
          <p className="text-gray-400">
            Actualmente no tenemos canchas de {sport.name} disponibles.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sportFields.map((field, index) => (
            <div key={field.id} className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden group hover:bg-white/20 transition-all duration-300">
              <div className="aspect-video bg-gray-800 overflow-hidden">
                <img
                  src={field.image}
                  alt={field.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6">
                <div className="text-green-400 text-sm font-medium mb-2">
                  🏟️ {field.name}
                </div>
                <p className="text-gray-300 text-sm mb-4">{field.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-red-400 text-sm font-medium">
                   
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-lg">${field.pricePerHour}/hora</div>
                  </div>
                </div>
                
                <button
                  onClick={() => onFieldSelect(field)}
                  className="w-full mt-4 bg-gray-700/50 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-all duration-300"
                >
                  Reservar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};