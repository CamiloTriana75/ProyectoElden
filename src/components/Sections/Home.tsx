import React from 'react';
import { Calendar, Users, Trophy, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HomeProps {
  onSectionChange?: (section: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onSectionChange }) => {
  const { user } = useAuth();
  const isEmployee = user?.role === 'employee';

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-full md:max-w-3xl lg:max-w-6xl mx-auto">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
          Sistema de información para control de servicios
          <br className="hidden sm:block" />
          de un campo deportivo
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-green-300 mb-6 md:mb-8">
          Los campos deportivos Elden ofrecen canchas deportivas de diferentes disciplinas como los son:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-8 md:mb-12">
          <div className="text-green-300 text-sm sm:text-lg">- Baloncesto</div>
          <div className="text-green-300 text-sm sm:text-lg">- Fútbol</div>
          <div className="text-green-300 text-sm sm:text-lg">- Pádel</div>
          <div className="text-green-300 text-sm sm:text-lg">- Tenis</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center hover:bg-white/20 transition-all duration-300">
          <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-green-400 mx-auto mb-2 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">Reservas Fáciles</h3>
          <p className="text-green-200 text-sm sm:text-base">Sistema intuitivo de reserva de canchas deportivas</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center hover:bg-white/20 transition-all duration-300">
          <Users className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400 mx-auto mb-2 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">Múltiples Deportes</h3>
          <p className="text-green-200 text-sm sm:text-base">Canchas para fútbol, baloncesto, tenis y pádel</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center hover:bg-white/20 transition-all duration-300">
          <Trophy className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-400 mx-auto mb-2 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">Instalaciones Premium</h3>
          <p className="text-green-200 text-sm sm:text-base">Equipamiento de alta calidad e iluminación LED</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center hover:bg-white/20 transition-all duration-300">
          <Clock className="w-8 h-8 sm:w-12 sm:h-12 text-purple-400 mx-auto mb-2 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">Horarios Flexibles</h3>
          <p className="text-green-200 text-sm sm:text-base">Disponibilidad desde las 16:00 hasta medianoche</p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">¡Comienza a Reservar Hoy!</h2>
        <p className="text-green-200 mb-4 sm:mb-6 text-sm sm:text-base">
          Accede a nuestro sistema de reservas y disfruta de las mejores instalaciones deportivas
        </p>
        <div className={`flex flex-col ${isEmployee ? 'items-center' : 'sm:flex-row sm:justify-center'} gap-3 sm:gap-4`}>
          {!isEmployee && (
            <button
              className="bg-green-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium hover:bg-green-700 transition-colors text-base sm:text-lg"
              onClick={() => onSectionChange && onSectionChange('canchas')}
            >
              Ver Canchas Disponibles
            </button>
          )}
          <button
            className={`bg-blue-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-base sm:text-lg ${isEmployee ? 'mx-auto block' : ''}`}
            onClick={() => onSectionChange && onSectionChange('reservas')}
          >
            Mis Reservas
          </button>
        </div>
      </div>
    </div>
  );
};