import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, Position, DocumentType, PaymentMethod, Sport, Field, TimeSlot, Reservation } from '../types';
import { db } from '../services/database';
import LoadingSpinner from '../components/Layout/LoadingSpinner';

interface DataContextType {
  // Employees
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt'>) => Promise<void>;
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  
  // Positions
  positions: Position[];
  addPosition: (position: Omit<Position, 'id' | 'createdAt'>) => void;
  updatePosition: (id: string, position: Partial<Position>) => void;
  deletePosition: (id: string) => void;
  
  // Document Types
  documentTypes: DocumentType[];
  addDocumentType: (docType: Omit<DocumentType, 'id' | 'createdAt'>) => void;
  updateDocumentType: (id: string, docType: Partial<DocumentType>) => void;
  deleteDocumentType: (id: string) => void;
  
  // Payment Methods
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (method: Omit<PaymentMethod, 'id' | 'createdAt'>) => void;
  updatePaymentMethod: (id: string, method: Partial<PaymentMethod>) => void;
  deletePaymentMethod: (id: string) => void;
  
  // Sports
  sports: Sport[];
  addSport: (sport: Sport) => void;
  updateSport: (id: string, sport: Partial<Sport>) => void;
  deleteSport: (id: string) => void;
  
  // Fields
  fields: Field[];
  addField: (field: Field) => void;
  updateField: (id: string, field: Partial<Field>) => void;
  deleteField: (id: string) => void;
  
  // Time Slots
  timeSlots: TimeSlot[];
  addTimeSlot: (timeSlot: Omit<TimeSlot, 'id'>) => Promise<void>;
  updateTimeSlot: (id: string, timeSlot: Partial<TimeSlot>) => Promise<void>;
  deleteTimeSlot: (id: string) => Promise<void>;
  getFieldTimeSlots: (fieldId: string) => TimeSlot[];
  
  // Reservations
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => Promise<void>;
  updateReservation: (id: string, reservation: Partial<Reservation>) => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;
  getAvailableTimeSlots: (fieldId: string, date: string) => TimeSlot[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const STORAGE_KEYS = {
  employees: 'elden_employees',
  positions: 'elden_positions',
  documentTypes: 'elden_document_types',
  paymentMethods: 'elden_payment_methods',
  sports: 'elden_sports',
  fields: 'elden_fields',
  timeSlots: 'elden_time_slots',
  reservations: 'elden_reservations'
};

// Initial data
const initialPositions: Position[] = [
  { id: '1', name: 'Administrador', description: 'Administrador general', createdAt: new Date().toISOString() },
  { id: '2', name: 'Profesor de fútbol', description: 'Instructor de fútbol', createdAt: new Date().toISOString() },
  { id: '3', name: 'Recepcionista', description: 'Atención al cliente', createdAt: new Date().toISOString() },
  { id: '4', name: 'Mantenimiento', description: 'Mantenimiento de instalaciones', createdAt: new Date().toISOString() }
];

const initialDocumentTypes: DocumentType[] = [
  { id: '1', name: 'Cédula de ciudadanía', code: 'CC', createdAt: new Date().toISOString() },
  { id: '2', name: 'Tarjeta de identidad', code: 'TI', createdAt: new Date().toISOString() },
  { id: '3', name: 'Cédula de extranjería', code: 'CE', createdAt: new Date().toISOString() },
  { id: '4', name: 'Pasaporte', code: 'PA', createdAt: new Date().toISOString() }
];

const initialPaymentMethods: PaymentMethod[] = [
  { id: '1', name: 'Efectivo', description: 'Pago en efectivo', isActive: true, createdAt: new Date().toISOString() },
  { id: '2', name: 'Tarjeta de crédito', description: 'Pago con tarjeta de crédito', isActive: true, createdAt: new Date().toISOString() },
  { id: '3', name: 'Tarjeta débito', description: 'Pago con tarjeta débito', isActive: true, createdAt: new Date().toISOString() },
  { id: '4', name: 'Transferencia bancaria', description: 'Transferencia electrónica', isActive: true, createdAt: new Date().toISOString() },
  { id: '5', name: 'PSE', description: 'Pagos Seguros en Línea', isActive: true, createdAt: new Date().toISOString() }
];

const initialSports: Sport[] = [
  { id: 'futbol', name: 'Fútbol', icon: '⚽', color: 'bg-green-500' },
  { id: 'baloncesto', name: 'Baloncesto', icon: '🏀', color: 'bg-orange-500' },
  { id: 'tenis', name: 'Tenis', icon: '🎾', color: 'bg-yellow-500' },
  { id: 'padel', name: 'Pádel', icon: '🏓', color: 'bg-blue-500' }
];

const initialFields: Field[] = [
  // Fútbol
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
  // Baloncesto
  {
    id: 'baloncesto-1',
    name: 'Cancha Principal',
    sportId: 'baloncesto',
    description: 'Cancha profesional de baloncesto con superficie acrílica y tableros de cristal',
    image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg',
    features: ['Superficie acrílica', 'Tableros de cristal', 'Iluminación LED', 'Gradas'],
    pricePerHour: 40
  },
  {
    id: 'baloncesto-2',
    name: 'Cancha Secundaria',
    sportId: 'baloncesto',
    description: 'Cancha de entrenamiento con superficie de concreto y tableros estándar',
    image: 'https://images.pexels.com/photos/1080675/pexels-photo-1080675.jpeg',
    features: ['Superficie de concreto', 'Tableros estándar', 'Iluminación básica'],
    pricePerHour: 25
  },
  // Tenis
  {
    id: 'tenis-1',
    name: 'Cancha Clay Court',
    sportId: 'tenis',
    description: 'Cancha profesional de tenis con superficie de arcilla y red oficial',
    image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg',
    features: ['Superficie de arcilla', 'Red oficial', 'Iluminación nocturna', 'Bancos'],
    pricePerHour: 45
  },
  {
    id: 'tenis-2',
    name: 'Cancha Hard Court',
    sportId: 'tenis',
    description: 'Cancha de tenis con superficie dura y equipamiento completo',
    image: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg',
    features: ['Superficie dura', 'Red oficial', 'Iluminación LED'],
    pricePerHour: 35
  },
  // Pádel
  {
    id: 'padel-1',
    name: 'Cancha Premium',
    sportId: 'padel',
    description: 'Cancha de pádel con cristales panorámicos y césped artificial premium',
    image: 'https://images.pexels.com/photos/8007497/pexels-photo-8007497.jpeg',
    features: ['Cristales panorámicos', 'Césped artificial premium', 'Iluminación LED', 'Vestuarios'],
    pricePerHour: 55
  },
  {
    id: 'padel-2',
    name: 'Cancha Estándar',
    sportId: 'padel',
    description: 'Cancha de pádel estándar con paredes de ladrillo y césped artificial',
    image: 'https://images.pexels.com/photos/6203541/pexels-photo-6203541.jpeg',
    features: ['Paredes de ladrillo', 'Césped artificial', 'Iluminación básica'],
    pricePerHour: 40
  }
];

// Sample time slots data - Empty array, employees will configure their own
const initialTimeSlots: TimeSlot[] = [];

// Sample reservations data - Empty array to start with clean data
const initialReservations: Reservation[] = [];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State declarations
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Inicializar la base de datos
        await db.init();
        
        // Cargar datos desde IndexedDB
        const [
          dbEmployees,
          dbPositions,
          dbDocumentTypes,
          dbPaymentMethods,
          dbSports,
          dbFields,
          dbTimeSlots,
          dbReservations
        ] = await Promise.all([
          db.getEmployees(),
          db.getPositions(),
          db.getDocumentTypes(),
          db.getPaymentMethods(),
          db.getSports(),
          db.getFields(),
          db.getTimeSlots(),
          db.getReservations()
        ]);

        // Establecer datos cargados
        setEmployees(dbEmployees as Employee[]);
        setPositions(dbPositions.length > 0 ? dbPositions as Position[] : initialPositions);
        setDocumentTypes(dbDocumentTypes.length > 0 ? dbDocumentTypes as DocumentType[] : initialDocumentTypes);
        setPaymentMethods(dbPaymentMethods.length > 0 ? dbPaymentMethods as PaymentMethod[] : initialPaymentMethods);
        setSports(dbSports.length > 0 ? dbSports as Sport[] : initialSports);
        setFields(dbFields.length > 0 ? dbFields as Field[] : initialFields);
        setTimeSlots(dbTimeSlots as TimeSlot[]); // Solo usar horarios configurados por empleados
        setReservations(dbReservations as Reservation[]);

        // Inicializar datos por defecto si es la primera vez (sin horarios)
        if (dbPositions.length === 0) {
          await db.initializeDefaultData({
            positions: initialPositions,
            documentTypes: initialDocumentTypes,
            paymentMethods: initialPaymentMethods,
            sports: initialSports,
            fields: initialFields,
            timeSlots: [] // No inicializar horarios predefinidos
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing database:', error);
        // Fallback a localStorage si IndexedDB falla
        loadFromLocalStorage();
        setIsLoading(false);
      }
    };

    const loadFromLocalStorage = () => {
      // Load employees
      const savedEmployees = localStorage.getItem(STORAGE_KEYS.employees);
      if (savedEmployees) {
        setEmployees(JSON.parse(savedEmployees));
      }

      // Load positions
      const savedPositions = localStorage.getItem(STORAGE_KEYS.positions);
      if (savedPositions) {
        setPositions(JSON.parse(savedPositions));
      } else {
        setPositions(initialPositions);
        localStorage.setItem(STORAGE_KEYS.positions, JSON.stringify(initialPositions));
      }

      // Load document types
      const savedDocTypes = localStorage.getItem(STORAGE_KEYS.documentTypes);
      if (savedDocTypes) {
        setDocumentTypes(JSON.parse(savedDocTypes));
      } else {
        setDocumentTypes(initialDocumentTypes);
        localStorage.setItem(STORAGE_KEYS.documentTypes, JSON.stringify(initialDocumentTypes));
      }

      // Load payment methods
      const savedPaymentMethods = localStorage.getItem(STORAGE_KEYS.paymentMethods);
      if (savedPaymentMethods) {
        setPaymentMethods(JSON.parse(savedPaymentMethods));
      } else {
        setPaymentMethods(initialPaymentMethods);
        localStorage.setItem(STORAGE_KEYS.paymentMethods, JSON.stringify(initialPaymentMethods));
      }

      // Load sports
      const savedSports = localStorage.getItem(STORAGE_KEYS.sports);
      if (savedSports) {
        setSports(JSON.parse(savedSports));
      } else {
        setSports(initialSports);
        localStorage.setItem(STORAGE_KEYS.sports, JSON.stringify(initialSports));
      }

      // Load fields
      const savedFields = localStorage.getItem(STORAGE_KEYS.fields);
      if (savedFields) {
        setFields(JSON.parse(savedFields));
      } else {
        setFields(initialFields);
        localStorage.setItem(STORAGE_KEYS.fields, JSON.stringify(initialFields));
      }

      // Load time slots
      const savedTimeSlots = localStorage.getItem(STORAGE_KEYS.timeSlots);
      if (savedTimeSlots) {
        setTimeSlots(JSON.parse(savedTimeSlots));
      } else {
        setTimeSlots([]); // No inicializar con horarios predefinidos
        localStorage.setItem(STORAGE_KEYS.timeSlots, JSON.stringify([]));
      }

      // Load reservations - NO eliminar, mantener persistencia
      const savedReservations = localStorage.getItem(STORAGE_KEYS.reservations);
      if (savedReservations) {
        setReservations(JSON.parse(savedReservations));
      } else {
        setReservations([]); // Inicializar con array vacío en lugar de datos de ejemplo
        localStorage.setItem(STORAGE_KEYS.reservations, JSON.stringify([]));
      }
    };

    initializeData();
  }, []);

  // Employee management functions
  const addEmployee = async (employee: Omit<Employee, 'id' | 'createdAt'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    
    try {
      await db.addEmployee(newEmployee);
    } catch (error) {
      console.error('Error saving to database, using localStorage fallback:', error);
      localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(updatedEmployees));
    }
  };

  const updateEmployee = async (id: string, employee: Partial<Employee>) => {
    const updatedEmployees = employees.map(emp => 
      emp.id === id ? { ...emp, ...employee } : emp
    );
    setEmployees(updatedEmployees);
    
    try {
      const employeeToUpdate = updatedEmployees.find(emp => emp.id === id);
      if (employeeToUpdate) {
        await db.updateEmployee(employeeToUpdate);
      }
    } catch (error) {
      console.error('Error updating in database, using localStorage fallback:', error);
      localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(updatedEmployees));
    }
  };

  const deleteEmployee = async (id: string) => {
    const updatedEmployees = employees.filter(emp => emp.id !== id);
    setEmployees(updatedEmployees);
    
    try {
      await db.deleteEmployee(id);
    } catch (error) {
      console.error('Error deleting from database, using localStorage fallback:', error);
      localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(updatedEmployees));
    }
  };

  // Position management functions
  const addPosition = (position: Omit<Position, 'id' | 'createdAt'>) => {
    const newPosition: Position = {
      ...position,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedPositions = [...positions, newPosition];
    setPositions(updatedPositions);
    localStorage.setItem(STORAGE_KEYS.positions, JSON.stringify(updatedPositions));
  };

  const updatePosition = (id: string, position: Partial<Position>) => {
    const updatedPositions = positions.map(pos => 
      pos.id === id ? { ...pos, ...position } : pos
    );
    setPositions(updatedPositions);
    localStorage.setItem(STORAGE_KEYS.positions, JSON.stringify(updatedPositions));
  };

  const deletePosition = (id: string) => {
    const updatedPositions = positions.filter(pos => pos.id !== id);
    setPositions(updatedPositions);
    localStorage.setItem(STORAGE_KEYS.positions, JSON.stringify(updatedPositions));
  };

  // Document type management functions
  const addDocumentType = (docType: Omit<DocumentType, 'id' | 'createdAt'>) => {
    const newDocType: DocumentType = {
      ...docType,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedDocTypes = [...documentTypes, newDocType];
    setDocumentTypes(updatedDocTypes);
    localStorage.setItem(STORAGE_KEYS.documentTypes, JSON.stringify(updatedDocTypes));
  };

  const updateDocumentType = (id: string, docType: Partial<DocumentType>) => {
    const updatedDocTypes = documentTypes.map(dt => 
      dt.id === id ? { ...dt, ...docType } : dt
    );
    setDocumentTypes(updatedDocTypes);
    localStorage.setItem(STORAGE_KEYS.documentTypes, JSON.stringify(updatedDocTypes));
  };

  const deleteDocumentType = (id: string) => {
    const updatedDocTypes = documentTypes.filter(dt => dt.id !== id);
    setDocumentTypes(updatedDocTypes);
    localStorage.setItem(STORAGE_KEYS.documentTypes, JSON.stringify(updatedDocTypes));
  };

  // Payment method management functions
  const addPaymentMethod = (method: Omit<PaymentMethod, 'id' | 'createdAt'>) => {
    const newMethod: PaymentMethod = {
      ...method,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedMethods = [...paymentMethods, newMethod];
    setPaymentMethods(updatedMethods);
    localStorage.setItem(STORAGE_KEYS.paymentMethods, JSON.stringify(updatedMethods));
  };

  const updatePaymentMethod = (id: string, method: Partial<PaymentMethod>) => {
    const updatedMethods = paymentMethods.map(pm => 
      pm.id === id ? { ...pm, ...method } : pm
    );
    setPaymentMethods(updatedMethods);
    localStorage.setItem(STORAGE_KEYS.paymentMethods, JSON.stringify(updatedMethods));
  };

  const deletePaymentMethod = (id: string) => {
    const updatedMethods = paymentMethods.filter(pm => pm.id !== id);
    setPaymentMethods(updatedMethods);
    localStorage.setItem(STORAGE_KEYS.paymentMethods, JSON.stringify(updatedMethods));
  };

  // Sport management functions
  const addSport = (sport: Sport) => {
    const updatedSports = [...sports, sport];
    setSports(updatedSports);
    localStorage.setItem(STORAGE_KEYS.sports, JSON.stringify(updatedSports));
  };

  const updateSport = (id: string, sport: Partial<Sport>) => {
    const updatedSports = sports.map(s => 
      s.id === id ? { ...s, ...sport } : s
    );
    setSports(updatedSports);
    localStorage.setItem(STORAGE_KEYS.sports, JSON.stringify(updatedSports));
  };

  const deleteSport = (id: string) => {
    const updatedSports = sports.filter(s => s.id !== id);
    setSports(updatedSports);
    localStorage.setItem(STORAGE_KEYS.sports, JSON.stringify(updatedSports));
  };

  // Field management functions
  const addField = (field: Field) => {
    const updatedFields = [...fields, field];
    setFields(updatedFields);
    localStorage.setItem(STORAGE_KEYS.fields, JSON.stringify(updatedFields));
  };

  const updateField = (id: string, field: Partial<Field>) => {
    const updatedFields = fields.map(f => 
      f.id === id ? { ...f, ...field } : f
    );
    setFields(updatedFields);
    localStorage.setItem(STORAGE_KEYS.fields, JSON.stringify(updatedFields));
  };

  const deleteField = (id: string) => {
    const updatedFields = fields.filter(f => f.id !== id);
    setFields(updatedFields);
    localStorage.setItem(STORAGE_KEYS.fields, JSON.stringify(updatedFields));
  };

  // Time slot management functions
  const addTimeSlot = async (timeSlot: Omit<TimeSlot, 'id'>) => {
    const newTimeSlot: TimeSlot = {
      ...timeSlot,
      id: Date.now().toString()
    };
    const updatedTimeSlots = [...timeSlots, newTimeSlot];
    setTimeSlots(updatedTimeSlots);
    
    try {
      await db.addTimeSlot(newTimeSlot);
    } catch (error) {
      console.error('Error saving time slot to database, using localStorage fallback:', error);
      localStorage.setItem(STORAGE_KEYS.timeSlots, JSON.stringify(updatedTimeSlots));
    }
  };

  const updateTimeSlot = async (id: string, timeSlot: Partial<TimeSlot>) => {
    const updatedTimeSlots = timeSlots.map(ts => 
      ts.id === id ? { ...ts, ...timeSlot } : ts
    );
    setTimeSlots(updatedTimeSlots);
    
    try {
      const timeSlotToUpdate = updatedTimeSlots.find(ts => ts.id === id);
      if (timeSlotToUpdate) {
        await db.updateTimeSlot(timeSlotToUpdate);
      }
    } catch (error) {
      console.error('Error updating time slot in database, using localStorage fallback:', error);
      localStorage.setItem(STORAGE_KEYS.timeSlots, JSON.stringify(updatedTimeSlots));
    }
  };

  const deleteTimeSlot = async (id: string) => {
    const updatedTimeSlots = timeSlots.filter(ts => ts.id !== id);
    setTimeSlots(updatedTimeSlots);
    
    try {
      await db.deleteTimeSlot(id);
    } catch (error) {
      console.error('Error deleting time slot from database, using localStorage fallback:', error);
      localStorage.setItem(STORAGE_KEYS.timeSlots, JSON.stringify(updatedTimeSlots));
    }
  };

  const getFieldTimeSlots = (fieldId: string): TimeSlot[] => {
    return timeSlots.filter(slot => slot.fieldId === fieldId && slot.isActive);
  };

  // Reservation management functions
  const addReservation = async (reservation: Omit<Reservation, 'id' | 'createdAt'>) => {
    const newReservation: Reservation = {
      ...reservation,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedReservations = [...reservations, newReservation];
    setReservations(updatedReservations);
    
    try {
      await db.addReservation(newReservation);
    } catch (error) {
      console.error('Error saving reservation to database, using localStorage fallback:', error);
      localStorage.setItem(STORAGE_KEYS.reservations, JSON.stringify(updatedReservations));
    }
  };

  const updateReservation = async (id: string, reservation: Partial<Reservation>) => {
    const updatedReservations = reservations.map(res => 
      res.id === id ? { ...res, ...reservation } : res
    );
    setReservations(updatedReservations);
    
    try {
      const reservationToUpdate = updatedReservations.find(res => res.id === id);
      if (reservationToUpdate) {
        await db.updateReservation(reservationToUpdate);
      }
    } catch (error) {
      console.error('Error updating reservation in database, using localStorage fallback:', error);
      localStorage.setItem(STORAGE_KEYS.reservations, JSON.stringify(updatedReservations));
    }
    
    // If reservation is being confirmed, mark the time slot as unavailable
    if (reservation.status === 'confirmed') {
      const confirmedReservation = updatedReservations.find(res => res.id === id);
      if (confirmedReservation) {
        const updatedTimeSlots = timeSlots.map(slot => 
          slot.id === confirmedReservation.timeSlotId ? { ...slot, isAvailable: false } : slot
        );
        setTimeSlots(updatedTimeSlots);
        
        try {
          const timeSlotToUpdate = updatedTimeSlots.find(slot => slot.id === confirmedReservation.timeSlotId);
          if (timeSlotToUpdate) {
            await db.updateTimeSlot(timeSlotToUpdate);
          }
        } catch (error) {
          console.error('Error updating time slot in database, using localStorage fallback:', error);
          localStorage.setItem(STORAGE_KEYS.timeSlots, JSON.stringify(updatedTimeSlots));
        }
      }
    }
    
    // If reservation is being cancelled, mark the time slot as available again
    if (reservation.status === 'cancelled') {
      const cancelledReservation = updatedReservations.find(res => res.id === id);
      if (cancelledReservation) {
        const updatedTimeSlots = timeSlots.map(slot => 
          slot.id === cancelledReservation.timeSlotId ? { ...slot, isAvailable: true } : slot
        );
        setTimeSlots(updatedTimeSlots);
        
        try {
          const timeSlotToUpdate = updatedTimeSlots.find(slot => slot.id === cancelledReservation.timeSlotId);
          if (timeSlotToUpdate) {
            await db.updateTimeSlot(timeSlotToUpdate);
          }
        } catch (error) {
          console.error('Error updating time slot in database, using localStorage fallback:', error);
          localStorage.setItem(STORAGE_KEYS.timeSlots, JSON.stringify(updatedTimeSlots));
        }
      }
    }
  };

  const deleteReservation = async (id: string) => {
    const updatedReservations = reservations.filter(res => res.id !== id);
    setReservations(updatedReservations);
    
    try {
      await db.deleteReservation(id);
    } catch (error) {
      console.error('Error deleting reservation from database, using localStorage fallback:', error);
      localStorage.setItem(STORAGE_KEYS.reservations, JSON.stringify(updatedReservations));
    }
  };

  const getAvailableTimeSlots = (fieldId: string, date: string): TimeSlot[] => {
    // Get all time slots for the field
    const fieldTimeSlots = timeSlots.filter(slot => slot.fieldId === fieldId && slot.isActive);
    
    // Filter out time slots that are already reserved for this date
    const reservedTimeSlotIds = reservations
      .filter(res => res.fieldId === fieldId && res.date === date && res.status !== 'cancelled')
      .map(res => res.timeSlotId);
    
    return fieldTimeSlots.filter(slot => 
      slot.isAvailable && !reservedTimeSlotIds.includes(slot.id)
    );
  };

  return (
    <DataContext.Provider value={{
      employees, addEmployee, updateEmployee, deleteEmployee,
      positions, addPosition, updatePosition, deletePosition,
      documentTypes, addDocumentType, updateDocumentType, deleteDocumentType,
      paymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod,
      sports, addSport, updateSport, deleteSport,
      fields, addField, updateField, deleteField,
      timeSlots, addTimeSlot, updateTimeSlot, deleteTimeSlot, getFieldTimeSlots,
      reservations, addReservation, updateReservation, deleteReservation, getAvailableTimeSlots
    }}>
      {isLoading ? (
        <LoadingSpinner message="Inicializando base de datos..." />
      ) : (
        children
      )}
    </DataContext.Provider>
  );
};