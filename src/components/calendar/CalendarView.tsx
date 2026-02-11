import React, { useMemo, useState } from 'react';
import Calendar, { CalendarTileProperties } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useData } from '../../contexts/DataContext';
import { Reservation } from '../../types';

interface CalendarViewProps {
  onDateSelect?: (date: Date) => void;
  isAdminOrEmployee?: boolean;
  onMakeReservation?: (date?: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  onDateSelect,
  isAdminOrEmployee = false,
  onMakeReservation,
}) => {
  const { reservations, fields, setSelectedDate, selectedDate } = useData();
  const [activeDate, setActiveDate] = useState<Date>(
    selectedDate ? new Date(selectedDate) : new Date()
  );

  // Build a quick lookup to color tiles and render counters.
  const reservationsByDate = useMemo(() => {
    return reservations.reduce<Record<string, Reservation[]>>((acc, current) => {
      if (current.status === 'cancelled') return acc;
      const key = current.date;
      acc[key] = acc[key] ? [...acc[key], current] : [current];
      return acc;
    }, {});
  }, [reservations]);

  const dayReservations = useMemo(() => {
    const key = format(activeDate, 'yyyy-MM-dd');
    return reservationsByDate[key] ?? [];
  }, [activeDate, reservationsByDate]);

  const getFieldName = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    return field?.name ?? 'Cancha';
  };

  const tileClassName = ({ date, view }: CalendarTileProperties) => {
    if (view !== 'month') return '';
    const key = format(date, 'yyyy-MM-dd');
    const count = reservationsByDate[key]?.length ?? 0;
    if (count >= 5) return 'rc-tile rc-tile--busy';
    if (count > 0) return 'rc-tile rc-tile--booked';
    return 'rc-tile rc-tile--free';
  };

  const tileContent = ({ date, view }: CalendarTileProperties) => {
    if (view !== 'month') return null;
    const key = format(date, 'yyyy-MM-dd');
    const count = reservationsByDate[key]?.length ?? 0;
    if (count === 0) return null;
    return (
      <span className="absolute bottom-1 right-1 px-2 py-0.5 text-[10px] rounded-full bg-black/50 text-white">
        {count}
      </span>
    );
  };

  const handleDayClick = (date: Date) => {
    setActiveDate(date);
    setSelectedDate(format(date, 'yyyy-MM-dd'));
    onDateSelect?.(date);
  };

  const handleMakeReservation = () => {
    onMakeReservation?.(activeDate);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="bg-gray-900/70 border border-white/10 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-400">Elden Sports Fields</p>
            <h2 className="text-2xl font-semibold text-white">Calendario de Reservas</h2>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-200">
            <div className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500/30" />
              <span>Disponible</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-500/40" />
              <span>Reservas</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500/40" />
              <span>Alta demanda</span>
            </div>
          </div>
        </div>

        <div className="calendar-card relative overflow-hidden rounded-xl bg-gray-950/60">
          <Calendar
            locale="en-US"
            onClickDay={handleDayClick}
            value={activeDate}
            tileClassName={tileClassName}
            tileContent={tileContent}
            className="w-full max-w-xl mx-auto  p-4 text-white"
          />
        </div>
      </div>

      <div className="bg-gray-900/80 border border-white/10 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400">Fecha seleccionada</p>
            <h3 className="text-xl font-semibold text-white">
              {format(activeDate, "EEEE, MMMM d")}
            </h3>
          </div>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors"
            onClick={handleMakeReservation}
          >
            Crear reserva
          </button>
        </div>

        {dayReservations.length === 0 ? (
          <div className="text-gray-400 text-sm bg-white/5 border border-dashed border-white/10 rounded-xl p-6 text-center">
            No hay reservas para este día. Haz clic en el calendario para iniciar una.
          </div>
        ) : (
          <ul className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {dayReservations.map((reservation) => (
              <li
                key={reservation.id}
                className="flex flex-col gap-1 bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <div className="flex items-center justify-between text-sm text-white">
                  <span className="font-semibold">
                    {reservation.startTime} - {reservation.endTime}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide ${
                      reservation.status === 'confirmed'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-yellow-500/20 text-yellow-200'
                    }`}
                  >
                    {reservation.status}
                  </span>
                </div>
                <p className="text-gray-300 text-sm">{getFieldName(reservation.fieldId)}</p>
                {isAdminOrEmployee && (
                  <p className="text-gray-400 text-xs">Usuario: {reservation.userId}</p>
                )}
                <p className="text-gray-500 text-xs">ID franja: {reservation.timeSlotId}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

    <style>{`

    /* NAVIGATION BAR FIX */
.calendar-card .react-calendar__navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
  /* ARROW BUTTONS */
.calendar-card .react-calendar__navigation__arrow {
  font-size: 1.9rem;          /* icon bigger */
  padding: 6px 10px;
  border-radius: 0.6rem;
  transition: all 0.15s ease;
  color: white;
}
/* HOVER STATE */
.calendar-card .react-calendar__navigation__arrow:hover {
  background: rgba(255,255,255,0.15);
  color: #22c55e;
}

/* ALL NAV BUTTONS */
.calendar-card .react-calendar__navigation button {
  background: transparent !important;
  color: white;
  border: none;
  font-weight: 600;
}

/* REMOVE GREY HOVER BLOCK */
.calendar-card .react-calendar__navigation button:hover,
.calendar-card .react-calendar__navigation button:focus,
.calendar-card .react-calendar__navigation button:active {
  background: transparent !important;
  box-shadow: none !important;
}

/* MONTH LABEL (CENTER TEXT) */
.calendar-card .react-calendar__navigation__label {
  pointer-events: none;
  background: transparent !important;
}


.calendar-card .react-calendar {
  background: transparent;
  border: none;
  width: 100%;
  font-family: inherit;
}

/* GRID */
.calendar-card .react-calendar__month-view__days {
  display: grid !important;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

/* BASE TILE */
.calendar-card .react-calendar__tile {
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.7rem;
  font-size: 0.9rem;
  color: white;
  transition: all 0.15s ease;
}

/* TODAY (CURRENT DATE) */
.calendar-card .react-calendar__tile--now {
  background: rgba(59,130,246,0.25);
  border: 1px solid rgba(59,130,246,0.7);
  color: #93c5fd;
  font-weight: 700;
}

/* SELECTED DATE */
.calendar-card .react-calendar__tile--active {
  background: #22c55e !important;
  color: white !important;
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(34,197,94,0.4);
}

/* OTHER MONTH DAYS */
.calendar-card .react-calendar__month-view__days__day--neighboringMonth {
  
  color: #ef4444;
}

/* HOVER */
.calendar-card .react-calendar__tile:enabled:hover {
  background: rgba(255,255,255,0.12);
  color: white !important;
}

/* FREE / BOOKED / BUSY */
.rc-tile--free {
  background: rgba(34,197,94,0.08);
}

.rc-tile--booked {
  background: rgba(234,179,8,0.18);
}

.rc-tile--busy {
  background: rgba(239,68,68,0.22);
}
`}</style>


    </div>
  );
};

export { CalendarView };
export default CalendarView;
