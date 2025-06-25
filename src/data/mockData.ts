import { Sport, Field, TimeSlot, Reservation } from '../types';

export const sports: Sport[] = [
  {
    id: 'futbol',
    name: 'Fútbol',
    icon: '⚽',
    color: 'bg-green-500'
  },
  {
    id: 'baloncesto',
    name: 'Baloncesto',
    icon: '🏀',
    color: 'bg-orange-500'
  },
  {
    id: 'tenis',
    name: 'Tenis',
    icon: '🎾',
    color: 'bg-yellow-500'
  },
  {
    id: 'padel',
    name: 'Pádel',
    icon: '🏓',
    color: 'bg-blue-500'
  }
];

export const fields: Field[] = [
  {
    id: 'futbol-1',
    name: 'Cancha Sintética 1',
    sportId: 'futbol',
    description: 'Cancha de fútbol 7 con césped artificial de alta calidad. Iluminación LED y zonas de descanso',
    image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg',
    features: ['Césped artificial', 'Iluminación LED', 'Zonas de descanso', 'Vestuarios'],
    pricePerHour: 50
  },
  {
    id: 'futbol-2',
    name: 'Cancha Sintética 2',
    sportId: 'futbol',
    description: 'Cancha de fútbol 5 con césped artificial de media calidad, sin iluminación y zonas de descanso',
    image: 'https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg',
    features: ['Césped artificial', 'Zonas de descanso'],
    pricePerHour: 35
  },
  {
    id: 'baloncesto-1',
    name: 'Cancha de Baloncesto Principal',
    sportId: 'baloncesto',
    description: 'Cancha profesional de baloncesto con superficie acrílica y tableros de cristal',
    image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg',
    features: ['Superficie acrílica', 'Tableros de cristal', 'Iluminación LED', 'Gradas'],
    pricePerHour: 40
  },
  {
    id: 'baloncesto-2',
    name: 'Cancha de Baloncesto Secundaria',
    sportId: 'baloncesto',
    description: 'Cancha de entrenamiento con superficie de concreto y tableros estándar',
    image: 'https://images.pexels.com/photos/1080675/pexels-photo-1080675.jpeg',
    features: ['Superficie de concreto', 'Tableros estándar', 'Iluminación básica'],
    pricePerHour: 25
  },
  {
    id: 'tenis-1',
    name: 'Cancha de Tenis Clay Court',
    sportId: 'tenis',
    description: 'Cancha profesional de tenis con superficie de arcilla y red oficial',
    image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg',
    features: ['Superficie de arcilla', 'Red oficial', 'Iluminación nocturna', 'Bancos'],
    pricePerHour: 45
  },
  {
    id: 'tenis-2',
    name: 'Cancha de Tenis Hard Court',
    sportId: 'tenis',
    description: 'Cancha de tenis con superficie dura y equipamiento completo',
    image: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg',
    features: ['Superficie dura', 'Red oficial', 'Iluminación LED'],
    pricePerHour: 35
  },
  {
    id: 'padel-1',
    name: 'Cancha de Pádel Premium',
    sportId: 'padel',
    description: 'Cancha de pádel con cristales panorámicos y césped artificial premium',
    image: 'https://images.pexels.com/photos/8007497/pexels-photo-8007497.jpeg',
    features: ['Cristales panorámicos', 'Césped artificial premium', 'Iluminación LED', 'Vestuarios'],
    pricePerHour: 55
  },
  {
    id: 'padel-2',
    name: 'Cancha de Pádel Estándar',
    sportId: 'padel',
    description: 'Cancha de pádel estándar con paredes de ladrillo y césped artificial',
    image: 'https://images.pexels.com/photos/6203541/pexels-photo-6203541.jpeg',
    features: ['Paredes de ladrillo', 'Césped artificial', 'Iluminación básica'],
    pricePerHour: 40
  }
];

export const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 16;
  const endHour = 24;
  
  for (let hour = startHour; hour < endHour; hour++) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
    
    slots.push({
      id: `slot-${hour}`,
      startTime,
      endTime,
      isAvailable: Math.random() > 0.3, // 70% chance of being available
      price: 50
    });
  }
  
  return slots;
};

export const mockReservations: Reservation[] = [
  {
    id: '1',
    userId: '1',
    fieldId: 'futbol-1',
    sportName: 'Fútbol',
    fieldName: 'Cancha Sintética 1',
    date: '2025-01-20',
    timeSlot: '18:00-19:00',
    status: 'confirmed',
    totalPrice: 50,
    createdAt: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    userId: '1',
    fieldId: 'tenis-1',
    sportName: 'Tenis',
    fieldName: 'Cancha de Tenis Clay Court',
    date: '2025-01-22',
    timeSlot: '20:00-21:00',
    status: 'pending',
    totalPrice: 45,
    createdAt: '2025-01-16T14:30:00Z'
  }
];