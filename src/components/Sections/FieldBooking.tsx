import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Field } from '../../types';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface FieldBookingProps {
  field: Field;
  onBack: () => void;
  onBookingComplete: () => void;
}

export const FieldBooking: React.FC<FieldBookingProps> = ({ field, onBack, onBookingComplete }) => {
  const { user } = useAuth();
  const { addReservation, timeSlots, reservations } = useData();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Uso fallback para evitar undefined en field y slot
  const fieldId = field.id || '';
  const allDaySlots = timeSlots.filter(ts => ts.fieldId === fieldId && ts.isActive && ((ts as any).allDays === true || (ts as any).date === selectedDate));
  
  // Defino el tipo local para los slots con price e isAvailable
  type SlotWithStatus = typeof allDaySlots[number] & { isAvailable: boolean; price: number };
  const confirmedReservations = reservations.filter(r => r.fieldId === fieldId && r.date === selectedDate && r.status === 'confirmed');
  const slotsWithStatus: SlotWithStatus[] = allDaySlots.map(slot => {
    const isReserved = confirmedReservations.some(reservation => {
      const slotStart = slot.startTime || '';
      const slotEnd = slot.endTime || '';
      const reservationStart = reservation.startTime || '';
      const reservationEnd = reservation.endTime || '';
      return slotStart < reservationEnd && slotEnd > reservationStart;
    });
    return { ...slot, isAvailable: !isReserved, price: (slot as any).price || 0 };
  });

  const selectedSlot = slotsWithStatus.find(slot => slot.id === selectedTimeSlot) || null;
  
  const handleBooking = async () => {
    if (!selectedTimeSlot || !selectedSlot || !user) return;
    
    // Safety Checks
    if (!user.id || !field.id) {
      setValidationError('User or field information is missing');
      return;
    }

    // Clear any previous errors
    setValidationError(null);

    // Validar que los campos requeridos estén presentes
    if (!selectedSlot.startTime || !selectedSlot.endTime) {
      console.error('❌ Error: startTime o endTime no están definidos');
      return;
    }
    
    // Check if slot is still available (double-check)
    if (!selectedSlot.isAvailable) {
      setValidationError('This time slot is no longer available');
      return;
    }
    
    // Check business hours (adjust times as needed)
    const slotHour = parseInt(selectedSlot.startTime.split(':')[0]);
    if (slotHour < 8 || slotHour > 22) {
      setValidationError('Bookings are only available between 8 AM and 10 PM');
      return;
    }

    // Only set this if validation passes
    setIsBooking(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create reservation
    addReservation({
      userId: user.id,
      fieldId: field.id,
      date: selectedDate,
      startTime: selectedSlot.startTime!,
      endTime: selectedSlot.endTime!,
      totalPrice: selectedSlot.price,
      paymentMethodId: 'default',
      status: 'pending',
    });
    
    setIsBooking(false);
    onBookingComplete();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
        <h1 className="text-3xl font-bold text-white">
          Horario {field.name}
        </h1>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
        <div className="aspect-video bg-gray-800 rounded-lg mb-4 overflow-hidden">
          <img
            src={field.image}
            alt={field.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <Calendar className="w-5 h-5 text-green-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={format(new Date(), 'yyyy-MM-dd')}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

    {validationError && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
          {validationError}
        </div>
      )}

      {slotsWithStatus.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 text-center">
          <Clock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No hay horarios disponibles</h3>
          <p className="text-gray-400">
            No se han configurado horarios para esta cancha o no hay disponibilidad para la fecha seleccionada.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {slotsWithStatus.map((slot) => (
              <button
                key={slot.id}
                onClick={() => slot.isAvailable && slot.id && setSelectedTimeSlot(slot.id)}
                disabled={!slot.isAvailable}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedTimeSlot === slot.id
                    ? 'bg-green-600 border-green-500 text-white'
                    : slot.isAvailable
                    ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:border-gray-500'
                    : 'bg-red-900/50 border-red-800 text-red-400 cursor-not-allowed'
                }`}
              >
                <div className="text-center">
                  <div className="font-bold text-lg">
                    {slot.startTime}-{slot.endTime}
                  </div>
                  <div className="text-sm opacity-75">
                    {slot.isAvailable ? `$${slot.price}` : 'Reservado'}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {selectedTimeSlot && selectedSlot && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Resumen de Reserva</h3>
              <div className="space-y-3 text-green-200">
                <div className="flex justify-between">
                  <span>Cancha:</span>
                  <span className="text-white font-medium">{field.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fecha:</span>
                  <span className="text-white font-medium">
                    {format(new Date(selectedDate), 'dd MMMM yyyy', { locale: es })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Horario:</span>
                  <span className="text-white font-medium">
                    {selectedSlot.startTime} - {selectedSlot.endTime}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-600 pt-3">
                  <span>Total:</span>
                  <span className="text-green-400">${selectedSlot.price}</span>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={handleBooking}
              disabled={!selectedTimeSlot || isBooking}
              className="bg-gray-700/50 text-white px-12 py-4 rounded-lg font-bold text-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isBooking ? 'Procesando...' : 'Reservar'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};