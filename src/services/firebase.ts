import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, onSnapshot, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

// Configuración de Firebase - NECESITAS REEMPLAZAR ESTO CON TUS PROPIAS CREDENCIALES
const firebaseConfig = {
  apiKey: "AIzaSyDuIZp_jqzjGYbz9tVfLpthPCLEMISwquo",
  authDomain: "elden-reservations.firebaseapp.com",
  projectId: "elden-reservations",
  storageBucket: "elden-reservations.firebasestorage.app",
  messagingSenderId: "268338523202",
  appId: "1:268338523202:web:819944f7d18ba5397b51db"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Tipos de datos
export interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  documentType?: string;
  documentNumber?: string;
  role: 'admin' | 'employee' | 'client';
  createdAt?: any;
}

export interface Employee {
  id?: string;
  name: string;
  email: string;
  phone: string;
  positionId: string;
  documentType: string;
  documentNumber: string;
  isActive: boolean;
  createdAt?: any;
}

export interface Position {
  id?: string;
  name: string;
  description: string;
  createdAt?: any;
}

export interface DocumentType {
  id?: string;
  name: string;
  code: string;
  createdAt?: any;
}

export interface PaymentMethod {
  id?: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt?: any;
}

export interface Sport {
  id?: string;
  name: string;
  icon: string;
  color: string;
}

export interface Field {
  id: string;
  name: string;
  sportId: string;
  pricePerHour: number;
  sport?: string;
  price?: number;
  description?: string;
  image?: string;
  images: string[];
  features: string[];
  createdAt?: any;
}

export interface TimeSlot {
  id?: string;
  fieldId: string;
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  price: number;
  dayOfWeek: string;
  isAvailable: boolean;
  isActive: boolean;
  date?: string; // Fecha exacta (YYYY-MM-DD), opcional
}

export interface Reservation {
  id?: string;
  userId: string;
  fieldId: string;
  date: string; // Format: "YYYY-MM-DD"
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  totalPrice: number;
  paymentMethodId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt?: any;
}

export interface Message {
  id?: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  content: string;
  status: 'read' | 'unread';
  createdAt?: any;
}

// Normalizes Field documents to ensure sport/price/id are always present
const normalizeField = (data: any, id: string): Field => {
  const sportId = typeof data?.sportId === 'string' ? data.sportId : typeof data?.sport === 'string' ? data.sport : '';
  const sport = typeof data?.sport === 'string' ? data.sport : sportId;
  const basePrice = typeof data?.price === 'number' ? data.price : undefined;
  const perHour = typeof data?.pricePerHour === 'number' ? data.pricePerHour : undefined;
  const pricePerHour = perHour ?? basePrice ?? 0;
  const price = basePrice ?? perHour ?? 0;

  return {
    ...data,
    id,
    sport,
    sportId,
    price,
    pricePerHour,
    name: data?.name ?? 'Cancha',
    description: data?.description ?? '',
    image: data?.image ?? '',
    images: Array.isArray(data?.images) ? data.images : [],
    features: Array.isArray(data?.features) ? data.features : [],
  };
};

// Ensures fields written to Firestore carry both sport + sportId and price aliases
const prepareFieldForWrite = (data: Partial<Field>) => {
  const sportId = typeof data.sportId === 'string' ? data.sportId : typeof data.sport === 'string' ? data.sport : '';
  const sport = typeof data.sport === 'string' ? data.sport : sportId;
  const price =
    typeof data.price === 'number'
      ? data.price
      : typeof data.pricePerHour === 'number'
      ? data.pricePerHour
      : 0;
  const pricePerHour =
    typeof data.pricePerHour === 'number'
      ? data.pricePerHour
      : typeof data.price === 'number'
      ? data.price
      : 0;

  return {
    ...data,
    sport,
    sportId,
    price,
    pricePerHour,
    images: Array.isArray(data?.images) ? data.images : [],
    features: Array.isArray(data?.features) ? data.features : [],
  };
};

// Servicio de autenticación
export class AuthService {
  static async register(email: string, password: string, userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Crear documento de usuario en Firestore
      const userDoc = {
        ...userData,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'users'), userDoc);
      
      return {
        id: docRef.id,
        ...userData
      };
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  static async login(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  static onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
}

// Servicio de base de datos
export class DatabaseService {
  // Métodos genéricos CRUD
  static async getAll<T>(collectionName: string): Promise<T[]> {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      if (collectionName === 'fields') {
        return querySnapshot.docs.map((doc) => normalizeField(doc.data(), doc.id)) as T[];
      }

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
    } catch (error) {
      console.error(`Error getting all ${collectionName}:`, error);
      throw error;
    }
  }

  static async get<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        if (collectionName === 'fields') {
          return normalizeField(docSnap.data(), docSnap.id) as T;
        }

        return {
          id: docSnap.id,
          ...docSnap.data()
        } as T;
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error getting ${collectionName} with id ${id}:`, error);
      throw error;
    }
  }

  static async add<T>(collectionName: string, data: Omit<T, 'id' | 'createdAt'>): Promise<T> {
    try {
      const baseData = collectionName === 'fields'
        ? prepareFieldForWrite(data as Partial<Field>)
        : data;

      const docData = {
        ...baseData,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, collectionName), docData);
      
      if (collectionName === 'fields') {
        return normalizeField(docData, docRef.id) as T;
      }

      return {
        id: docRef.id,
        ...data
      } as T;
    } catch (error) {
      console.error(`Error adding ${collectionName}:`, error);
      throw error;
    }
  }

  static async update<T>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      const payload = collectionName === 'fields'
        ? prepareFieldForWrite(data as Partial<Field>)
        : data;
      await updateDoc(docRef, payload as any);
    } catch (error) {
      console.error(`Error updating ${collectionName} with id ${id}:`, error);
      throw error;
    }
  }

  static async delete(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting ${collectionName} with id ${id}:`, error);
      throw error;
    }
  }

  // Métodos específicos para cada entidad
  static async getUsers(): Promise<User[]> {
    return this.getAll<User>('users');
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as User;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  static async getReservations(): Promise<Reservation[]> {
    try {
      const q = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reservation[];
    } catch (error) {
      console.error('Error getting reservations:', error);
      throw error;
    }
  }

  static async getReservationsByUser(userId: string): Promise<Reservation[]> {
    try {
      const q = query(
        collection(db, 'reservations'), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reservation[];
    } catch (error) {
      console.error('Error getting user reservations:', error);
      throw error;
    }
  }

  static async getReservationsByFieldAndDate(fieldId: string, date: string): Promise<Reservation[]> {
    try {
      const q = query(
        collection(db, 'reservations'), 
        where('fieldId', '==', fieldId),
        where('date', '==', date)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reservation[];
    } catch (error) {
      console.error('Error getting field reservations:', error);
      throw error;
    }
  }

  // Listeners en tiempo real
  static onUsersChange(callback: (users: User[]) => void) {
    return onSnapshot(collection(db, 'users'), (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      callback(users);
    });
  }

  static onReservationsChange(callback: (reservations: Reservation[]) => void) {
    const q = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const reservations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reservation[];
      callback(reservations);
    });
  }

  static onUserReservationsChange(userId: string, callback: (reservations: Reservation[]) => void) {
    const q = query(
      collection(db, 'reservations'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const reservations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reservation[];
      callback(reservations);
    });
  }

  static onTimeSlotsChange(callback: (timeSlots: TimeSlot[]) => void) {
    const q = query(collection(db, 'timeSlots'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const timeSlots = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TimeSlot[];
      callback(timeSlots);
    });
  }

  // Inicializar datos por defecto
  static async initializeDefaultData(): Promise<void> {
    try {
      console.log('🔧 Initializing default data...');
      
      // Verificar si ya hay datos
      const positions = await this.getAll<Position>('positions');
      if (positions.length === 0) {
        console.log('➕ Creating default positions...');
        const defaultPositions = [
          { name: 'Administrador', description: 'Administrador general' },
          { name: 'Profesor de fútbol', description: 'Instructor de fútbol' },
          { name: 'Recepcionista', description: 'Atención al cliente' },
          { name: 'Mantenimiento', description: 'Mantenimiento de instalaciones' }
        ];
        
        for (const position of defaultPositions) {
          await this.add<Position>('positions', position);
        }
      }

      const documentTypes = await this.getAll<DocumentType>('documentTypes');
      if (documentTypes.length === 0) {
        console.log('➕ Creating default document types...');
        const defaultDocTypes = [
          { name: 'Cédula de ciudadanía', code: 'CC' },
          { name: 'Tarjeta de identidad', code: 'TI' },
          { name: 'Cédula de extranjería', code: 'CE' },
          { name: 'Pasaporte', code: 'PA' },
          { name: 'NIT', code: 'NIT' },
          { name: 'RUT', code: 'RUT' }
        ];
        
        for (const docType of defaultDocTypes) {
          await this.add<DocumentType>('documentTypes', docType);
        }
      }

      const paymentMethods = await this.getAll<PaymentMethod>('paymentMethods');
      if (paymentMethods.length === 0) {
        console.log('➕ Creating default payment methods...');
        const defaultPaymentMethods = [
          { name: 'Efectivo', description: 'Pago en efectivo', isActive: true },
          { name: 'Tarjeta de crédito', description: 'Pago con tarjeta de crédito', isActive: true },
          { name: 'Tarjeta débito', description: 'Pago con tarjeta débito', isActive: true },
          { name: 'Transferencia bancaria', description: 'Transferencia electrónica', isActive: true },
          { name: 'PSE', description: 'Pagos Seguros en Línea', isActive: true }
        ];
        
        for (const method of defaultPaymentMethods) {
          await this.add<PaymentMethod>('paymentMethods', method);
        }
      }

      const sports = await this.getAll<Sport>('sports');
      if (sports.length === 0) {
        console.log('➕ Creating default sports...');
        const defaultSports = [
          { name: 'Fútbol', icon: '⚽', color: 'bg-green-500' },
          { name: 'Baloncesto', icon: '🏀', color: 'bg-orange-500' },
          { name: 'Tenis', icon: '🎾', color: 'bg-yellow-500' },
          { name: 'Pádel', icon: '🏓', color: 'bg-blue-500' }
        ];
        
        for (const sport of defaultSports) {
          await this.add<Sport>('sports', sport);
        }
      }

      const fields = await this.getAll<Field>('fields');
      if (fields.length === 0) {
        console.log('➕ Creating default fields...');
        const defaultFields = [
          {
            name: 'Cancha Sintética 1',
            sportId: 'futbol',
            description: 'Cancha de fútbol 7 con césped artificial de alta calidad',
            image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg',
            images: [
              'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg',
              'https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg',
            ],
            features: ['Césped artificial', 'Iluminación LED', 'Zonas de descanso', 'Vestuarios'],
            pricePerHour: 50
          },
          {
            name: 'Cancha Sintética 2',
            sportId: 'futbol',
            description: 'Cancha de fútbol 5 con césped artificial',
            image: 'https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg',
            images: [],
            features: ['Césped artificial', 'Zonas de descanso'],
            pricePerHour: 35
          },
          {
            name: 'Cancha Principal',
            sportId: 'baloncesto',
            description: 'Cancha profesional de baloncesto',
            image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg',
            images: [],
            features: ['Superficie acrílica', 'Tableros de cristal', 'Iluminación LED', 'Gradas'],
            pricePerHour: 40
          }
        ];
        
        for (const field of defaultFields) {
          await this.add<Field>('fields', field);
        }
      }

      // Crear horarios de ejemplo para cada cancha
      const allFields = await this.getAll<Field>('fields');
      const timeSlots = await this.getAll('timeSlots');
      if (timeSlots.length === 0) {
        console.log('➕ Creating example time slots for each field...');
        for (const field of allFields) {
          // Lunes (1): 08:00-10:00 y 10:00-12:00
          await this.add('timeSlots', {
            fieldId: field.id,
            startTime: '08:00',
            endTime: '10:00',
            isActive: true
          });
          await this.add('timeSlots', {
            fieldId: field.id,
            startTime: '10:00',
            endTime: '12:00',
            isActive: true
          });
        }
      }

      // Crear empleado por defecto si no existe
      const employees = await this.getAll<Employee>('employees');
      if (employees.length === 0) {
        console.log('➕ Creating default employee...');
        const defaultEmployee = {
          name: 'Juan Pérez',
          email: 'empleado@elden.com',
          phone: '+57 300 987 6543',
          positionId: 'recepcionista', // Asumiendo que se creó el cargo de recepcionista
          documentType: 'CC',
          documentNumber: '12345678',
          isActive: true
        };
        
        await this.add<Employee>('employees', defaultEmployee);
      }

      console.log('✅ Default data initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing default data:', error);
      throw error;
    }
  }

  // Crear usuarios por defecto para iniciar sesión
  static async createDefaultUsers(): Promise<void> {
    try {
      console.log('👤 Creating default users for login...');
      
      // Verificar si ya existen usuarios
      const users = await this.getAll<User>('users');
      const existingEmails = users.map(u => u.email);
      
      // Crear administrador si no existe
      if (!existingEmails.includes('admin@elden.com')) {
        console.log('➕ Creating default admin user...');
        try {
          await AuthService.register('admin@elden.com', 'admin123', {
            name: 'Administrador',
            email: 'admin@elden.com',
            phone: '+57 300 123 4567',
            role: 'admin'
          });
          console.log('✅ Admin user created successfully');
        } catch (error) {
          console.log('⚠️ Admin user might already exist in Firebase Auth');
        }
      }
      
      // Crear empleado si no existe
      if (!existingEmails.includes('empleado@elden.com')) {
        console.log('➕ Creating default employee user...');
        try {
          await AuthService.register('empleado@elden.com', 'empleado123', {
            name: 'Juan Pérez',
            email: 'empleado@elden.com',
            phone: '+57 300 987 6543',
            documentType: 'CC',
            documentNumber: '12345678',
            role: 'employee'
          });
          console.log('✅ Employee user created successfully');
        } catch (error) {
          console.log('⚠️ Employee user might already exist in Firebase Auth');
        }
      }
      
      console.log('✅ Default users created successfully');
    } catch (error) {
      console.error('❌ Error creating default users:', error);
      throw error;
    }
  }
}

export { db, auth };
