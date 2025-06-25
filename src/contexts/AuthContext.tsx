import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { db } from '../services/database';

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

// Extend User type to include password
interface UserWithPassword extends User {
  password: string;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await db.init();
        
        // Check if we have a saved user session
        const savedUser = localStorage.getItem('elden_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          // Verify user still exists in database
          const userExists = await db.get('users', parsedUser.id);
          if (userExists) {
            setUser(parsedUser);
          } else {
            localStorage.removeItem('elden_user');
          }
        }
        
        // Initialize default admin and employee if they don't exist
        await initializeDefaultUsers();
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const initializeDefaultUsers = async () => {
    try {
      console.log('Initializing default users...');
      const users = await db.getAll('users') as UserWithPassword[];
      console.log('Current users in database:', users.length);
      
      // Create default admin if doesn't exist
      const adminExists = users.find((u: UserWithPassword) => u.email === 'admin@elden.com');
      if (!adminExists) {
        console.log('Creating default admin...');
        const adminUser: UserWithPassword = {
          id: 'admin',
          name: 'Administrador',
          email: 'admin@elden.com',
          password: 'admin123', // In production, this should be hashed
          phone: '+57 300 123 4567',
          role: 'admin'
        };
        await db.add('users', adminUser);
        console.log('Default admin created');
      } else {
        console.log('Default admin already exists');
      }
      
      // Create default employee if doesn't exist
      const employeeExists = users.find((u: UserWithPassword) => u.email === 'empleado@elden.com');
      if (!employeeExists) {
        console.log('Creating default employee...');
        const employeeUser: UserWithPassword = {
          id: 'empleado',
          name: 'Empleado',
          email: 'empleado@elden.com',
          password: 'empleado123', // In production, this should be hashed
          phone: '+57 300 987 6543',
          role: 'employee'
        };
        await db.add('users', employeeUser);
        console.log('Default employee created');
      } else {
        console.log('Default employee already exists');
      }
      
      // Log final state
      const finalUsers = await db.getAll('users') as UserWithPassword[];
      console.log('Final users in database:', finalUsers.length);
      console.log('User emails:', finalUsers.map(u => u.email));
      
    } catch (error) {
      console.error('Error initializing default users:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get all users from database
      const users = await db.getAll('users') as UserWithPassword[];
      
      // Find user by email
      const user = users.find(u => u.email === email);
      
      if (!user) {
        return false; // User not found
      }
      
      // Check password (in production, this should be hashed comparison)
      if (user.password !== password) {
        return false; // Wrong password
      }
      
      // Remove password from user object before setting state
      const { password: _, ...userWithoutPassword } = user;
      
      setUser(userWithoutPassword);
      localStorage.setItem('elden_user', JSON.stringify(userWithoutPassword));
      return true;
      
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, phone: string, documentType?: string, documentNumber?: string): Promise<boolean> => {
    try {
      console.log('Starting registration for:', email);
      
      // Check if user already exists
      const users = await db.getAll('users') as UserWithPassword[];
      console.log('Current users in database:', users.length);
      console.log('Existing users:', users.map(u => u.email));
      
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        console.log('User already exists:', email);
        return false; // User already exists
      }
      
      console.log('Creating new user:', email);
      
      // Create new user
      const newUser: UserWithPassword = {
        id: Date.now().toString(),
        name,
        email,
        password, // In production, this should be hashed
        phone,
        documentType,
        documentNumber,
        role: 'client'
      };
      
      // Save to database
      await db.add('users', newUser);
      console.log('User saved to database successfully');
      
      // Remove password from user object before setting state
      const { password: _, ...userWithoutPassword } = newUser;
      
      setUser(userWithoutPassword);
      localStorage.setItem('elden_user', JSON.stringify(userWithoutPassword));
      console.log('Registration completed successfully');
      return true;
      
    } catch (error) {
      console.error('Error during registration:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('elden_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};