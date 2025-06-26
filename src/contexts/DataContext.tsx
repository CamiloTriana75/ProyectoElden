import React, { createContext, useContext, useState, useEffect } from 'react';
import { DatabaseService, Employee, Position, DocumentType, PaymentMethod, Sport, Field, TimeSlot, Reservation } from '../services/firebase';
import LoadingSpinner from '../components/Layout/LoadingSpinner';
import { AuthService } from '../services/firebase';

interface DataContextType {
  // Employees
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt'> & { password: string }) => Promise<void>;
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  
  // Positions
  positions: Position[];
  addPosition: (position: Omit<Position, 'id' | 'createdAt'>) => Promise<void>;
  updatePosition: (id: string, position: Partial<Position>) => Promise<void>;
  deletePosition: (id: string) => Promise<void>;
  
  // Document Types
  documentTypes: DocumentType[];
  addDocumentType: (docType: Omit<DocumentType, 'id' | 'createdAt'>) => Promise<void>;
  updateDocumentType: (id: string, docType: Partial<DocumentType>) => Promise<void>;
  deleteDocumentType: (id: string) => Promise<void>;
  
  // Payment Methods
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (method: Omit<PaymentMethod, 'id' | 'createdAt'>) => Promise<void>;
  updatePaymentMethod: (id: string, method: Partial<PaymentMethod>) => Promise<void>;
  deletePaymentMethod: (id: string) => Promise<void>;
  
  // Sports
  sports: Sport[];
  addSport: (sport: Sport) => Promise<void>;
  updateSport: (id: string, sport: Partial<Sport>) => Promise<void>;
  deleteSport: (id: string) => Promise<void>;
  
  // Fields
  fields: Field[];
  addField: (field: Field) => Promise<void>;
  updateField: (id: string, field: Partial<Field>) => Promise<void>;
  deleteField: (id: string) => Promise<void>;
  
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
    console.log('🔧 Initializing DataContext...');
    
    const initializeData = async () => {
      try {
        // Cargar datos iniciales
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
          DatabaseService.getAll<Employee>('employees'),
          DatabaseService.getAll<Position>('positions'),
          DatabaseService.getAll<DocumentType>('documentTypes'),
          DatabaseService.getAll<PaymentMethod>('paymentMethods'),
          DatabaseService.getAll<Sport>('sports'),
          DatabaseService.getAll<Field>('fields'),
          DatabaseService.getAll<TimeSlot>('timeSlots'),
          DatabaseService.getReservations()
        ]);

        console.log('📊 Data loaded:', {
          employees: dbEmployees.length,
          positions: dbPositions.length,
          documentTypes: dbDocumentTypes.length,
          paymentMethods: dbPaymentMethods.length,
          sports: dbSports.length,
          fields: dbFields.length,
          timeSlots: dbTimeSlots.length,
          reservations: dbReservations.length
        });

        // Establecer datos
        setEmployees(dbEmployees);
        setPositions(dbPositions);
        setDocumentTypes(dbDocumentTypes);
        setPaymentMethods(dbPaymentMethods);
        setSports(dbSports);
        setFields(dbFields);
        setTimeSlots(dbTimeSlots);
        setReservations(dbReservations);

        // Configurar listeners en tiempo real
        const unsubscribeReservations = DatabaseService.onReservationsChange((newReservations) => {
          console.log('🔄 Reservations updated:', newReservations.length);
          setReservations(newReservations);
        });

        const unsubscribeTimeSlots = DatabaseService.onTimeSlotsChange((newTimeSlots) => {
          console.log('🔄 TimeSlots updated:', newTimeSlots.length);
          setTimeSlots(newTimeSlots);
        });

        setIsLoading(false);

        return () => {
          unsubscribeReservations();
          unsubscribeTimeSlots();
        };
      } catch (error) {
        console.error('❌ Error initializing data:', error);
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Employee management functions
  const addEmployee = async (employee: Omit<Employee, 'id' | 'createdAt'> & { password: string }) => {
    try {
      // Crear usuario en AuthService
      const user = await AuthService.register(employee.email, employee.password, {
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        documentType: employee.documentType,
        documentNumber: employee.documentNumber,
        role: 'employee'
      });
      // Guardar empleado en la colección employees (sin la contraseña)
      const { password, ...employeeData } = employee;
      const newEmployee = await DatabaseService.add<Employee>('employees', employeeData);
      setEmployees((prev: Employee[]) => [...prev, newEmployee]);
      console.log('✅ Employee added:', newEmployee);
    } catch (error) {
      console.error('❌ Error adding employee:', error);
      throw error;
    }
  };

  const updateEmployee = async (id: string, employee: Partial<Employee>) => {
    try {
      await DatabaseService.update<Employee>('employees', id, employee);
      setEmployees((prev: Employee[]) => prev.map((emp: Employee) => emp.id === id ? { ...emp, ...employee } : emp));
      console.log('✅ Employee updated:', id);
    } catch (error) {
      console.error('❌ Error updating employee:', error);
      throw error;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await DatabaseService.delete('employees', id);
      setEmployees((prev: Employee[]) => prev.filter((emp: Employee) => emp.id !== id));
      console.log('✅ Employee deleted:', id);
    } catch (error) {
      console.error('❌ Error deleting employee:', error);
      throw error;
    }
  };

  // Position management functions
  const addPosition = async (position: Omit<Position, 'id' | 'createdAt'>) => {
    try {
      const newPosition = await DatabaseService.add<Position>('positions', position);
      setPositions(prev => [...prev, newPosition]);
      console.log('✅ Position added:', newPosition);
    } catch (error) {
      console.error('❌ Error adding position:', error);
      throw error;
    }
  };

  const updatePosition = async (id: string, position: Partial<Position>) => {
    try {
      await DatabaseService.update<Position>('positions', id, position);
      setPositions(prev => prev.map(pos => pos.id === id ? { ...pos, ...position } : pos));
      console.log('✅ Position updated:', id);
    } catch (error) {
      console.error('❌ Error updating position:', error);
      throw error;
    }
  };

  const deletePosition = async (id: string) => {
    try {
      await DatabaseService.delete('positions', id);
      setPositions(prev => prev.filter(pos => pos.id !== id));
      console.log('✅ Position deleted:', id);
    } catch (error) {
      console.error('❌ Error deleting position:', error);
      throw error;
    }
  };

  // Document Type management functions
  const addDocumentType = async (docType: Omit<DocumentType, 'id' | 'createdAt'>) => {
    try {
      const newDocType = await DatabaseService.add<DocumentType>('documentTypes', docType);
      setDocumentTypes(prev => [...prev, newDocType]);
      console.log('✅ Document type added:', newDocType);
    } catch (error) {
      console.error('❌ Error adding document type:', error);
      throw error;
    }
  };

  const updateDocumentType = async (id: string, docType: Partial<DocumentType>) => {
    try {
      await DatabaseService.update<DocumentType>('documentTypes', id, docType);
      setDocumentTypes(prev => prev.map(dt => dt.id === id ? { ...dt, ...docType } : dt));
      console.log('✅ Document type updated:', id);
    } catch (error) {
      console.error('❌ Error updating document type:', error);
      throw error;
    }
  };

  const deleteDocumentType = async (id: string) => {
    try {
      await DatabaseService.delete('documentTypes', id);
      setDocumentTypes(prev => prev.filter(dt => dt.id !== id));
      console.log('✅ Document type deleted:', id);
    } catch (error) {
      console.error('❌ Error deleting document type:', error);
      throw error;
    }
  };

  // Payment Method management functions
  const addPaymentMethod = async (method: Omit<PaymentMethod, 'id' | 'createdAt'>) => {
    try {
      const newMethod = await DatabaseService.add<PaymentMethod>('paymentMethods', method);
      setPaymentMethods(prev => [...prev, newMethod]);
      console.log('✅ Payment method added:', newMethod);
    } catch (error) {
      console.error('❌ Error adding payment method:', error);
      throw error;
    }
  };

  const updatePaymentMethod = async (id: string, method: Partial<PaymentMethod>) => {
    try {
      await DatabaseService.update<PaymentMethod>('paymentMethods', id, method);
      setPaymentMethods(prev => prev.map(pm => pm.id === id ? { ...pm, ...method } : pm));
      console.log('✅ Payment method updated:', id);
    } catch (error) {
      console.error('❌ Error updating payment method:', error);
      throw error;
    }
  };

  const deletePaymentMethod = async (id: string) => {
    try {
      await DatabaseService.delete('paymentMethods', id);
      setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
      console.log('✅ Payment method deleted:', id);
    } catch (error) {
      console.error('❌ Error deleting payment method:', error);
      throw error;
    }
  };

  // Sport management functions
  const addSport = async (sport: Sport) => {
    try {
      const newSport = await DatabaseService.add<Sport>('sports', sport);
      setSports(prev => [...prev, newSport]);
      console.log('✅ Sport added:', newSport);
    } catch (error) {
      console.error('❌ Error adding sport:', error);
      throw error;
    }
  };

  const updateSport = async (id: string, sport: Partial<Sport>) => {
    try {
      await DatabaseService.update<Sport>('sports', id, sport);
      setSports(prev => prev.map(s => s.id === id ? { ...s, ...sport } : s));
      console.log('✅ Sport updated:', id);
    } catch (error) {
      console.error('❌ Error updating sport:', error);
      throw error;
    }
  };

  const deleteSport = async (id: string) => {
    try {
      await DatabaseService.delete('sports', id);
      setSports(prev => prev.filter(s => s.id !== id));
      console.log('✅ Sport deleted:', id);
    } catch (error) {
      console.error('❌ Error deleting sport:', error);
      throw error;
    }
  };

  // Field management functions
  const addField = async (field: Field) => {
    try {
      const newField = await DatabaseService.add<Field>('fields', field);
      setFields(prev => [...prev, newField]);
      console.log('✅ Field added:', newField);
    } catch (error) {
      console.error('❌ Error adding field:', error);
      throw error;
    }
  };

  const updateField = async (id: string, field: Partial<Field>) => {
    try {
      await DatabaseService.update<Field>('fields', id, field);
      setFields(prev => prev.map(f => f.id === id ? { ...f, ...field } : f));
      console.log('✅ Field updated:', id);
    } catch (error) {
      console.error('❌ Error updating field:', error);
      throw error;
    }
  };

  const deleteField = async (id: string) => {
    try {
      await DatabaseService.delete('fields', id);
      setFields(prev => prev.filter(f => f.id !== id));
      console.log('✅ Field deleted:', id);
    } catch (error) {
      console.error('❌ Error deleting field:', error);
      throw error;
    }
  };

  // Time Slot management functions
  const addTimeSlot = async (timeSlot: Omit<TimeSlot, 'id'>) => {
    try {
      const newTimeSlot = await DatabaseService.add<TimeSlot>('timeSlots', timeSlot);
      setTimeSlots(prev => [...prev, newTimeSlot]);
      console.log('✅ Time slot added:', newTimeSlot);
    } catch (error) {
      console.error('❌ Error adding time slot:', error);
      throw error;
    }
  };

  const updateTimeSlot = async (id: string, timeSlot: Partial<TimeSlot>) => {
    try {
      await DatabaseService.update<TimeSlot>('timeSlots', id, timeSlot);
      setTimeSlots(prev => prev.map(ts => ts.id === id ? { ...ts, ...timeSlot } : ts));
      console.log('✅ Time slot updated:', id);
    } catch (error) {
      console.error('❌ Error updating time slot:', error);
      throw error;
    }
  };

  const deleteTimeSlot = async (id: string) => {
    try {
      await DatabaseService.delete('timeSlots', id);
      setTimeSlots(prev => prev.filter(ts => ts.id !== id));
      console.log('✅ Time slot deleted:', id);
    } catch (error) {
      console.error('❌ Error deleting time slot:', error);
      throw error;
    }
  };

  const getFieldTimeSlots = (fieldId: string): TimeSlot[] => {
    return timeSlots.filter(ts => ts.fieldId === fieldId && ts.isActive);
  };

  // Reservation management functions
  const addReservation = async (reservation: Omit<Reservation, 'id' | 'createdAt'>) => {
    try {
      const newReservation = await DatabaseService.add<Reservation>('reservations', reservation);
      console.log('✅ Reservation added:', newReservation);
      // No need to update state here as the real-time listener will handle it
    } catch (error) {
      console.error('❌ Error adding reservation:', error);
      throw error;
    }
  };

  const updateReservation = async (id: string, reservation: Partial<Reservation>) => {
    try {
      await DatabaseService.update<Reservation>('reservations', id, reservation);
      console.log('✅ Reservation updated:', id, 'Status:', reservation.status);
      
      // Si la reserva se confirma, elimina el horario correspondiente
      if (reservation.status === 'confirmed') {
        console.log('🔍 Buscando TimeSlot para eliminar...');
        
        // Buscar la reserva completa
        const updatedReservation = reservations.find(r => r.id === id);
        if (updatedReservation) {
          console.log('📋 Reserva encontrada:', {
            fieldId: updatedReservation.fieldId,
            date: updatedReservation.date,
            startTime: updatedReservation.startTime,
            endTime: updatedReservation.endTime
          });
          
          console.log('📊 Total de TimeSlots disponibles:', timeSlots.length);
          
          // Buscar el timeslot exacto con más criterios
          const matchingSlots = timeSlots.filter(ts => {
            const fieldMatch = ts.fieldId === updatedReservation.fieldId;
            const timeMatch = ts.startTime === updatedReservation.startTime && ts.endTime === updatedReservation.endTime;
            const dateMatch = (ts as any).date === updatedReservation.date || (ts as any).allDays === true;
            
            console.log('🔍 Comparando TimeSlot:', {
              id: ts.id,
              fieldId: ts.fieldId,
              startTime: ts.startTime,
              endTime: ts.endTime,
              date: (ts as any).date,
              allDays: (ts as any).allDays,
              fieldMatch,
              timeMatch,
              dateMatch
            });
            
            return fieldMatch && timeMatch && dateMatch;
          });
          
          console.log('🎯 TimeSlots que coinciden:', matchingSlots.length);
          
          if (matchingSlots.length > 0) {
            const slotToDelete = matchingSlots[0];
            console.log('🗑️ Eliminando TimeSlot:', slotToDelete.id);
            await deleteTimeSlot(slotToDelete.id!);
            console.log('✅ TimeSlot eliminado exitosamente:', slotToDelete.id);
          } else {
            console.log('❌ No se encontró TimeSlot para eliminar');
            console.log('📋 Criterios de búsqueda:', {
              fieldId: updatedReservation.fieldId,
              date: updatedReservation.date,
              startTime: updatedReservation.startTime,
              endTime: updatedReservation.endTime
            });
            console.log('🔍 TimeSlot disponible:', timeSlots[0] ? {
              id: timeSlots[0].id,
              fieldId: timeSlots[0].fieldId,
              startTime: timeSlots[0].startTime,
              endTime: timeSlots[0].endTime,
              date: (timeSlots[0] as any).date,
              allDays: (timeSlots[0] as any).allDays
            } : 'No hay TimeSlots');
          }
        } else {
          console.log('❌ No se encontró la reserva actualizada');
        }
      }
      // No need to update state here as the real-time listener will handle it
    } catch (error) {
      console.error('❌ Error updating reservation:', error);
      throw error;
    }
  };

  const deleteReservation = async (id: string) => {
    try {
      await DatabaseService.delete('reservations', id);
      console.log('✅ Reservation deleted:', id);
      // No need to update state here as the real-time listener will handle it
    } catch (error) {
      console.error('❌ Error deleting reservation:', error);
      throw error;
    }
  };

  const getAvailableTimeSlots = (fieldId: string, date: string): TimeSlot[] => {
    // Filtra por cancha y por fecha exacta o allDays
    const fieldTimeSlots = timeSlots.filter(ts => ts.fieldId === fieldId && ts.isActive);
    const dayTimeSlots = fieldTimeSlots.filter(ts => {
      const allDays = (ts as any).allDays;
      const slotDate = (ts as any).date;
      return allDays === true || (slotDate && slotDate === date);
    });

    // Solo reservas confirmadas bloquean el horario
    const dayReservations = reservations.filter(r => r.fieldId === fieldId && r.date === date && r.status === 'confirmed');

    // Filter out time slots that are already reserved
    return dayTimeSlots.filter(timeSlot => {
      const isReserved = dayReservations.some(reservation => {
        const reservationStart = reservation.startTime;
        const reservationEnd = reservation.endTime;
        const timeSlotStart = timeSlot.startTime;
        const timeSlotEnd = timeSlot.endTime;
        // Check if there's any overlap
        return (timeSlotStart < reservationEnd && timeSlotEnd > reservationStart);
      });
      return !isReserved;
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <DataContext.Provider value={{
      employees,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      positions,
      addPosition,
      updatePosition,
      deletePosition,
      documentTypes,
      addDocumentType,
      updateDocumentType,
      deleteDocumentType,
      paymentMethods,
      addPaymentMethod,
      updatePaymentMethod,
      deletePaymentMethod,
      sports,
      addSport,
      updateSport,
      deleteSport,
      fields,
      addField,
      updateField,
      deleteField,
      timeSlots,
      addTimeSlot,
      updateTimeSlot,
      deleteTimeSlot,
      getFieldTimeSlots,
      reservations,
      addReservation,
      updateReservation,
      deleteReservation,
      getAvailableTimeSlots
    }}>
      {children}
    </DataContext.Provider>
  );
};