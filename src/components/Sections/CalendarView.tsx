import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useData } from "../../contexts/DataContext";
import { format, isSameDay, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Clock, Info } from "lucide-react";
import { Reservation } from "../../types";

interface CalendarViewProps {
  onDateSelect?: (date: Date) => void;
  isAdminOrEmployee?: boolean;
  onMakeReservation?: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  onDateSelect,
  isAdminOrEmployee,
  onMakeReservation,
}) => {
  const { reservations, fields } = useData();
  const [value, setValue] = useState<Date>(new Date());
  const [selectedDateReservations, setSelectedDateReservations] = useState<
    Reservation[]
  >([]);
  const [showDayDetails, setShowDayDetails] = useState(false);

  const getDayReservations = (date: Date) => {
    return reservations.filter((res) => {
      // res.date is in format YYYY-MM-DD
      const resDate = parseISO(res.date);
      return isSameDay(resDate, date) && res.status !== "cancelled";
    });
  };

  const getOccupancyStatus = (date: Date) => {
    const dayReservations = getDayReservations(date);
    if (dayReservations.length === 0) return "available";

    // Simplistic occupancy logic:
    // In a real app, we'd compare with total available slots across all fields
    // For now, let's say > 5 reservations is 'high', 1-5 is 'medium'
    if (dayReservations.length > 5) return "high";
    return "medium";
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const status = getOccupancyStatus(date);
      if (status === "high") return "occupancy-high";
      if (status === "medium") return "occupancy-medium";
    }
    return "";
  };

  const handleDateChange = (date: unknown) => {
    const selectedDate = date as Date;
    setValue(selectedDate);
    const dayReservations = getDayReservations(selectedDate);
    setSelectedDateReservations(dayReservations);
    setShowDayDetails(true);
    if (onDateSelect) onDateSelect(selectedDate);
  };

  const getFieldName = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    return field ? field.name : "Cancha Desconocida";
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
      <div className="flex-1 bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Clock className="text-green-400" />
          Calendario de Disponibilidad
        </h2>
        <div className="calendar-container custom-calendar">
          <Calendar
            onChange={handleDateChange}
            value={value}
            locale="es-ES"
            tileClassName={tileClassName}
            className="w-full bg-transparent border-none text-white"
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500/50 rounded pointer-events-none"></div>
            <span className="text-gray-300">Alta Ocupación</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500/50 rounded pointer-events-none"></div>
            <span className="text-gray-300">Ocupación Media</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white/10 border border-white/20 rounded pointer-events-none"></div>
            <span className="text-gray-300">Disponible</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-96 bg-gray-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">
          {format(value, "d 'de' MMMM", { locale: es })}
        </h3>

        {showDayDetails ? (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {selectedDateReservations.length > 0 ? (
              selectedDateReservations.map((res) => (
                <div
                  key={res.id}
                  className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-green-400 font-bold">
                      {res.startTime} - {res.endTime}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        res.status === "confirmed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {res.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-white text-sm font-medium">
                    {getFieldName(res.fieldId)}
                  </div>
                  {isAdminOrEmployee && (
                    <div className="text-gray-400 text-xs mt-1">
                      Usuario ID: {res.userId}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Info className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No hay reservas para este día.</p>
                <div className="mt-4">
                  <p className="text-green-400 text-sm italic mb-4">
                    ¡Día perfecto para jugar!
                  </p>
                  <button
                    className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-bold shadow-lg shadow-green-900/20"
                    onClick={onMakeReservation}
                  >
                    Hacer Reserva
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 italic text-center">
            <p>
              Selecciona un día en el calendario para ver disponibilidad y
              reservas.
            </p>
          </div>
        )}
      </div>

      <style>{`
        .custom-calendar {
          --react-calendar-bg: transparent;
          --react-calendar-color: white;
        }
        .react-calendar {
          background: transparent !important;
          border: none !important;
          font-family: inherit !important;
          width: 100% !important;
        }
        .react-calendar__navigation button {
          color: white !important;
          font-size: 1.2rem !important;
          font-weight: bold !important;
        }
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: rgba(255, 255, 255, 0.1) !important;
          border-radius: 8px;
        }
        .react-calendar__month-view__weekdays {
          color: #4ade80 !important;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.8rem;
          margin-bottom: 1rem;
        }
        .react-calendar__tile {
          padding: 1.5em 0.5em !important;
          color: white !important;
          transition: all 0.2s;
          position: relative;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px;
          color: #4ade80 !important;
        }
        .react-calendar__tile--now {
          background: rgba(74, 222, 128, 0.1) !important;
          border-radius: 12px;
          font-weight: bold;
          color: #4ade80 !important;
          text-decoration: underline;
        }
        .react-calendar__tile--active {
          background: #16a34a !important;
          border-radius: 12px !important;
          color: white !important;
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.4);
        }
        .react-calendar__month-view__days__day--neighboringMonth {
          color: rgba(255, 255, 255, 0.2) !important;
        }
        
        /* Occupancy Styles */
        .occupancy-high {
          background-color: rgba(239, 68, 68, 0.3) !important;
          border-radius: 12px;
        }
        .occupancy-medium {
          background-color: rgba(234, 179, 8, 0.3) !important;
          border-radius: 12px;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};
