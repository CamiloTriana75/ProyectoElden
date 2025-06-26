import React, { useState } from 'react';
import { Filter, Calendar, Clock, DollarSign, CheckCircle, XCircle, AlertCircle, User, Check, X } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Reservation } from '../../types';

export const Reservations: React.FC = () => {
  const { user } = useAuth();
  const { reservations, updateReservation } = useData();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter reservations based on user role
  const isAdmin = user?.role === 'admin';
  const isEmployee = user?.role === 'employee';
  const userReservations = isAdmin || isEmployee
    ? reservations // Admin and Employee see all reservations
    : reservations.filter(res => res.userId === user?.id); // Users see only their reservations

  const filteredReservations = userReservations.filter(reservation => {
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    return matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const handleCancelReservation = (reservationId: string) => {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      updateReservation(reservationId, { status: 'cancelled' });
    }
  };

  const handleApproveReservation = (reservationId: string) => {
    if (confirm('¿Confirmar esta reserva?')) {
      updateReservation(reservationId, { status: 'confirmed' });
    }
  };

  const handleRejectReservation = (reservationId: string) => {
    if (confirm('¿Rechazar esta reserva?')) {
      updateReservation(reservationId, { status: 'cancelled' });
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-full md:max-w-3xl lg:max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-white">
          {isAdmin || isEmployee ? 'Gestión de Reservas' : 'Mis Reservas'}
        </h1>
        <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-2 sm:p-4">
          <div className="text-green-300 text-xs sm:text-sm mb-1 sm:mb-2">Filtros</div>
          <div className="flex flex-col gap-1 sm:gap-2">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="all-status"
                name="status"
                checked={statusFilter === 'all'}
                onChange={() => setStatusFilter('all')}
                className="text-green-500"
              />
              <label htmlFor="all-status" className="text-green-200 text-sm">Todas</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="pending"
                name="status"
                checked={statusFilter === 'pending'}
                onChange={() => setStatusFilter('pending')}
                className="text-yellow-500"
              />
              <label htmlFor="pending" className="text-yellow-200 text-sm">Pendientes</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="confirmed"
                name="status"
                checked={statusFilter === 'confirmed'}
                onChange={() => setStatusFilter('confirmed')}
                className="text-green-500"
              />
              <label htmlFor="confirmed" className="text-green-200 text-sm">Confirmadas</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="cancelled"
                name="status"
                checked={statusFilter === 'cancelled'}
                onChange={() => setStatusFilter('cancelled')}
                className="text-red-500"
              />
              <label htmlFor="cancelled" className="text-red-200 text-sm">Canceladas</label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm bg-transparent">
            <thead className="bg-gray-800/80">
              <tr>
                {(isAdmin || isEmployee) && (
                  <th className="px-6 py-4 text-left text-white font-medium">Usuario</th>
                )}
                <th className="px-6 py-4 text-left text-white font-medium">Cancha ID</th>
                <th className="px-6 py-4 text-left text-white font-medium">Fecha</th>
                <th className="px-6 py-4 text-left text-white font-medium">Hora Inicio</th>
                <th className="px-6 py-4 text-left text-white font-medium">Hora Fin</th>
                <th className="px-6 py-4 text-left text-white font-medium">Precio</th>
                <th className="px-6 py-4 text-left text-white font-medium">Estado</th>
                <th className="px-6 py-4 text-right text-white font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-white/5 transition-colors">
                  {(isAdmin || isEmployee) && (
                    <td className="px-6 py-4 text-green-300">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Usuario {reservation.userId}</span>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 text-white">{reservation.fieldId}</td>
                  <td className="px-6 py-4 text-green-300">{reservation.date}</td>
                  <td className="px-6 py-4 text-green-300">{reservation.startTime}</td>
                  <td className="px-6 py-4 text-green-300">{reservation.endTime}</td>
                  <td className="px-6 py-4 text-green-300">${reservation.totalPrice}</td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 ${getStatusColor(reservation.status)}`}>
                      {getStatusIcon(reservation.status)}
                      <span className="font-medium">{getStatusText(reservation.status)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {(isAdmin || isEmployee) ? (
                      // Admin and Employee actions
                      reservation.status === 'pending' ? (
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => handleApproveReservation(reservation.id!)}
                            className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Aprobar
                          </button>
                          <button 
                            onClick={() => handleRejectReservation(reservation.id!)}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
                          >
                            <X className="w-3 h-3" />
                            Rechazar
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          {reservation.status === 'confirmed' ? 'Aprobada' : 'Rechazada'}
                        </span>
                      )
                    ) : (
                      // User actions
                      (reservation.status === 'pending' || reservation.status === 'confirmed') && (
                        <button 
                          onClick={() => handleCancelReservation(reservation.id!)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                        >
                          CANCELAR RESERVA
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredReservations.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              {userReservations.length === 0 
                ? (isAdmin || isEmployee ? 'No hay reservas registradas' : 'No tienes reservas aún. ¡Haz tu primera reserva!')
                : 'No hay reservas que coincidan con los filtros seleccionados'
              }
            </p>
          </div>
        )}
      </div>

      {!(isAdmin || isEmployee) && filteredReservations.length > 0 && (
        <>
          <div className="flex justify-center mt-8">
            <div className="text-red-400 text-sm font-medium">
              
            </div>
          </div>

          <div className="text-center mt-4">
            
          </div>
        </>
      )}
    </div>
  );
};