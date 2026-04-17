import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { checkFirebaseStatus, forceInitializeData, showDatabaseInfo, resetDatabase } from './utils/databaseUtils'
import { DatabaseService, AuthService, Position, Employee } from './services/firebase'

// Agregar funciones globales para debugging
declare global {
  interface Window {
    eldenDB: {
      checkFirebase: () => Promise<boolean>;
      forceInit: () => Promise<boolean>;
      showInfo: () => Promise<void>;
      reset: () => Promise<void>;
      createEmployee: (employeeData: any) => Promise<void>;
      createAdmin: (adminData: any) => Promise<void>;
    };
  }
}

// Funciones globales para debugging de la base de datos
window.eldenDB = {
  checkFirebase: async () => {
    console.log('🔍 Checking Firebase from console...');
    const result = await checkFirebaseStatus();
    console.log(result ? '✅ Firebase OK' : '❌ Firebase Error');
    return result;
  },
  forceInit: async () => {
    console.log('🚀 Force initializing from console...');
    const result = await forceInitializeData();
    console.log(result ? '✅ Force init OK' : '❌ Force init Error');
    return result;
  },
  showInfo: async () => {
    console.log('📊 Showing database info from console...');
    await showDatabaseInfo();
  },
  reset: async () => {
    console.log('🧹 Resetting database from console...');
    await resetDatabase();
    console.log('✅ Database reset completed');
  },
  createEmployee: async (employeeData) => {
    console.log('👤 Creating employee from console...', employeeData);
    
    try {
      // Obtener cargos disponibles
      const positions = await DatabaseService.getAll<Position>('positions');
      console.log('📋 Available positions:', positions);
      
      // Buscar el cargo "Recepcionista"
      const recepcionista = positions.find((p: Position) => p.name === 'Recepcionista');
      if (!recepcionista) {
        console.error('❌ Cargo "Recepcionista" no encontrado');
        return;
      }
      
      // Crear el empleado
      const newEmployee = {
        name: employeeData.name || "María González",
        email: employeeData.email || "maria@elden.com",
        phone: employeeData.phone || "+57 300 555 1234",
        positionId: recepcionista.id!,
        documentType: employeeData.documentType || "CC",
        documentNumber: employeeData.documentNumber || "98765432",
        isActive: true
      };
      
      const createdEmployee = await DatabaseService.add<Employee>('employees', newEmployee);
      console.log('✅ Employee created:', createdEmployee);
      
      // Crear usuario de autenticación
      const password = employeeData.password || "empleado123";
      await AuthService.register(newEmployee.email, password, {
        name: newEmployee.name,
        email: newEmployee.email,
        phone: newEmployee.phone,
        documentType: newEmployee.documentType,
        documentNumber: newEmployee.documentNumber,
        role: 'employee'
      });
      
      console.log('✅ Authentication user created');
      console.log('📧 Login credentials:');
      console.log(`   Email: ${newEmployee.email}`);
      console.log(`   Password: ${password}`);
      
    } catch (error) {
      console.error('❌ Error creating employee:', error);
    }
  },
  createAdmin: async (adminData) => {
    console.log('👑 Creating admin from console...', adminData);

    try {
      const adminEmail = adminData.email || 'admin.demo@elden.com';
      const adminPassword = adminData.password || 'Admin123!';

      const createdAdmin = await AuthService.register(adminEmail, adminPassword, {
        name: adminData.name || 'Administrador Demo',
        email: adminEmail,
        phone: adminData.phone || '+57 300 000 0000',
        documentType: adminData.documentType || 'CC',
        documentNumber: adminData.documentNumber || '1000000000',
        role: 'admin',
      });

      console.log('✅ Admin created:', createdAdmin);
      console.log('📧 Login credentials:');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    } catch (error) {
      console.error('❌ Error creating admin:', error);
    }
  }
};

console.log('🔧 Elden DB Debug Tools Available:');
console.log('• window.eldenDB.checkFirebase() - Verificar Firebase');
console.log('• window.eldenDB.forceInit() - Forzar inicialización');
console.log('• window.eldenDB.showInfo() - Mostrar información');
console.log('• window.eldenDB.reset() - Reinicializar base de datos');
console.log('• window.eldenDB.createEmployee(data) - Crear empleado');
console.log('  Ejemplo: window.eldenDB.createEmployee({name: "Juan Pérez", email: "juan@elden.com"})');
console.log('• window.eldenDB.createAdmin(data) - Crear administrador');
console.log('  Ejemplo: window.eldenDB.createAdmin({name: "Admin", email: "admin@elden.com", password: "Admin123!"})');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
