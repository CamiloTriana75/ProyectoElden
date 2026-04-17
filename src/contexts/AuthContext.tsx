import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService, DatabaseService, User } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginAsDemoAdmin: () => void;
  register: (name: string, email: string, password: string, phone: string, documentType?: string, documentNumber?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoSession, setIsDemoSession] = useState(false);
  const shouldSeedFirebase = import.meta.env.VITE_ENABLE_FIREBASE_SEED === 'true';

  const buildFallbackUser = (email: string): User => ({
    id: email,
    name: email.split('@')[0] || 'Usuario',
    email,
    phone: '',
    role: 'client',
  });

  useEffect(() => {
    console.log('🔧 Initializing AuthContext...');
    
    const initializeAuth = async () => {
      try {
        if (shouldSeedFirebase) {
          // Solo para desarrollo: evita intentos de escritura automatica en produccion.
          await DatabaseService.initializeDefaultData();
          await DatabaseService.createDefaultUsers();
        }
        
        // Escuchar cambios en el estado de autenticación
        const unsubscribe = AuthService.onAuthStateChanged(async (firebaseUser) => {
          if (isDemoSession) {
            setIsLoading(false);
            return;
          }

          console.log('👤 Auth state changed:', firebaseUser?.email);
          
          if (firebaseUser) {
            const email = firebaseUser.email || '';

            if (!email) {
              setUser(null);
              setIsLoading(false);
              return;
            }

            try {
              // Obtener datos del usuario desde Firestore
              const userData = await DatabaseService.getUserByEmail(email);
              if (userData) {
                console.log('✅ User data retrieved:', userData);
                setUser(userData);
              } else {
                console.warn('⚠️ User profile not found in Firestore, using fallback user');
                setUser(buildFallbackUser(email));
              }
            } catch (error) {
              console.warn('⚠️ Could not load Firestore profile, using Auth fallback user');
              setUser(buildFallbackUser(email));
            }
          } else {
            console.log('👤 No user logged in');
            setUser(null);
          }
          
          setIsLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [shouldSeedFirebase, isDemoSession]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🚀 Attempting login for:', email);
      setIsDemoSession(false);
      
      // Intentar login con Firebase Auth
      await AuthService.login(email, password);
      
      console.log('✅ Login successful');
      return true;
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      return false;
    }
  };

  const loginAsDemoAdmin = () => {
    setIsDemoSession(true);
    setUser({
      id: 'demo-admin',
      name: 'Admin Demo',
      email: 'demo.admin@elden.com',
      phone: '+57 300 000 0000',
      role: 'admin',
    });
    setIsLoading(false);
  };

  const register = async (name: string, email: string, password: string, phone: string, documentType?: string, documentNumber?: string): Promise<boolean> => {
    try {
      console.log('🚀 Starting registration for:', email);
      console.log('📝 Registration data:', { name, email, phone, documentType, documentNumber });
      setIsDemoSession(false);
      
      // Crear usuario en Firebase Auth y Firestore
      const userData: Omit<User, 'id' | 'createdAt'> = {
        name,
        email,
        phone,
        documentType,
        documentNumber,
        role: 'client'
      };
      
      const newUser = await AuthService.register(email, password, userData);
      console.log('✅ Registration successful:', newUser);
      
      return true;
      
    } catch (error) {
      console.error('❌ Registration failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out...');
      if (!isDemoSession) {
        await AuthService.logout();
      }
      setIsDemoSession(false);
      setUser(null);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, loginAsDemoAdmin, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};