import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService, DatabaseService, User } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
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
  const shouldSeedFirebase = import.meta.env.VITE_ENABLE_FIREBASE_SEED === 'true';

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
          console.log('👤 Auth state changed:', firebaseUser?.email);
          
          if (firebaseUser) {
            try {
              // Obtener datos del usuario desde Firestore
              const userData = await DatabaseService.getUserByEmail(firebaseUser.email!);
              if (userData) {
                console.log('✅ User data retrieved:', userData);
                setUser(userData);
              } else {
                console.log('⚠️ User not found in Firestore, logging out');
                await AuthService.logout();
                setUser(null);
              }
            } catch (error) {
              console.error('❌ Error getting user data:', error);
              setUser(null);
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
  }, [shouldSeedFirebase]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🚀 Attempting login for:', email);
      
      // Intentar login con Firebase Auth
      await AuthService.login(email, password);
      
      console.log('✅ Login successful');
      return true;
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, phone: string, documentType?: string, documentNumber?: string): Promise<boolean> => {
    try {
      console.log('🚀 Starting registration for:', email);
      console.log('📝 Registration data:', { name, email, phone, documentType, documentNumber });
      
      // Verificar si el usuario ya existe
      const existingUser = await DatabaseService.getUserByEmail(email);
      if (existingUser) {
        console.log('⚠️ User already exists:', email);
        return false;
      }
      
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
      await AuthService.logout();
      setUser(null);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};