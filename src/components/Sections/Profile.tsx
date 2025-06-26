import React, { useState, useMemo } from 'react';
import { User, Mail, Phone, Calendar, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const { reservations } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Estadísticas de reservas del usuario
  const stats = useMemo(() => {
    if (!user) return { total: 0, month: 0, favorite: '-' };
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    // Solo reservas del usuario
    const userReservations = (reservations as any[]).filter(r => r.userId === user.id);
    // Reservas este mes
    const monthReservations = userReservations.filter(r => {
      const resDate = new Date(r.date);
      return resDate.getMonth() === currentMonth && resDate.getFullYear() === currentYear;
    });
    // Deporte favorito
    const sportCount: Record<string, number> = {};
    userReservations.forEach(r => {
      if (r.sportName) {
        sportCount[r.sportName] = (sportCount[r.sportName] || 0) + 1;
      }
    });
    let favorite = '-';
    let max = 0;
    Object.entries(sportCount).forEach(([sport, count]) => {
      if (count > max) {
        favorite = sport;
        max = count;
      }
    });
    return {
      total: userReservations.length,
      month: monthReservations.length,
      favorite
    };
  }, [reservations, user]);

  const handleSave = () => {
    // Here you would typically make an API call to update the user profile
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-8">Perfil de Usuario</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{user?.name}</h2>
          <p className="text-green-300 mb-4">Usuario Activo</p>
          <div className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg text-sm">
            Miembro desde Enero 2025
          </div>
        </div>

        <div className="lg:col-span-2 bg-white/10 backdrop-blur-sm rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Información Personal</h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Guardar
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <User className="w-5 h-5 text-green-400" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre Completo
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-white text-lg">{user?.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Mail className="w-5 h-5 text-green-400" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Correo Electrónico
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-white text-lg">{user?.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Phone className="w-5 h-5 text-green-400" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Teléfono
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-white text-lg">{user?.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-green-400" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fecha de Registro
                </label>
                <p className="text-white text-lg">15 de Enero, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Estadísticas de Reservas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{stats.total}</div>
            <p className="text-gray-300">Reservas Totales</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{stats.month}</div>
            <p className="text-gray-300">Reservas Este Mes</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.favorite}</div>
            <p className="text-gray-300">Deporte Favorito</p>
          </div>
        </div>
      </div>
    </div>
  );
};