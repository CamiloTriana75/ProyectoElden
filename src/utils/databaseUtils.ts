import { DatabaseService } from '../services/firebase';

// Función para verificar el estado de Firebase
export const checkFirebaseStatus = async () => {
  try {
    console.log('🔍 Checking Firebase status...');
    
    // Verificar conexión a Firestore
    const testDoc = await DatabaseService.add('test', { timestamp: new Date() });
    console.log('✅ Firestore connection successful');
    
    // Limpiar documento de prueba
    if (testDoc && typeof testDoc === 'object' && 'id' in testDoc && testDoc.id) {
      await DatabaseService.delete('test', testDoc.id as string);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
};

// Función para forzar la inicialización de datos
export const forceInitializeData = async () => {
  try {
    console.log('🚀 Force initializing data...');
    
    // Limpiar datos existentes primero
    await clearAllData();
    
    // Inicializar datos por defecto
    await DatabaseService.initializeDefaultData();
    
    // Crear usuarios por defecto
    await DatabaseService.createDefaultUsers();
    
    console.log('✅ Force initialization completed');
    return true;
  } catch (error) {
    console.error('❌ Force initialization failed:', error);
    return false;
  }
};

// Función para limpiar todos los datos
export const clearAllData = async () => {
  try {
    console.log('🧹 Clearing all data...');
    
    const collections = [
      'users',
      'employees', 
      'positions',
      'documentTypes',
      'paymentMethods',
      'sports',
      'fields',
      'timeSlots',
      'reservations',
      'messages'
    ];
    
    for (const collection of collections) {
      try {
        const items = await DatabaseService.getAll(collection);
        console.log(`📁 Clearing ${collection}: ${items.length} items`);
        
        for (const item of items) {
          if (item && typeof item === 'object' && 'id' in item && item.id) {
            await DatabaseService.delete(collection, item.id as string);
          }
        }
        console.log(`✅ Cleared collection: ${collection}`);
      } catch (error) {
        console.log(`⚠️ Could not clear collection: ${collection}`, error);
      }
    }
    
    console.log('✅ All data cleared');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    throw error;
  }
};

// Función para limpiar y reinicializar la base de datos
export const resetDatabase = async () => {
  try {
    console.log('🧹 Resetting database...');
    
    // Limpiar todas las colecciones
    const collections = [
      'users',
      'employees', 
      'positions',
      'documentTypes',
      'paymentMethods',
      'sports',
      'fields',
      'timeSlots',
      'reservations',
      'messages'
    ];
    
    for (const collection of collections) {
      try {
        const items = await DatabaseService.getAll(collection);
        for (const item of items) {
          if (item && typeof item === 'object' && 'id' in item && item.id) {
            await DatabaseService.delete(collection, item.id as string);
          }
        }
        console.log(`✅ Cleared collection: ${collection}`);
      } catch (error) {
        console.log(`⚠️ Could not clear collection: ${collection}`, error);
      }
    }
    
    // Reinicializar datos por defecto
    await DatabaseService.initializeDefaultData();
    await DatabaseService.createDefaultUsers();
    
    console.log('✅ Database reset completed successfully');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  }
};

// Función para mostrar información de la base de datos
export const showDatabaseInfo = async () => {
  try {
    console.log('📊 Database Information:');
    
    const collections = [
      'users',
      'employees', 
      'positions',
      'documentTypes',
      'paymentMethods',
      'sports',
      'fields',
      'timeSlots',
      'reservations',
      'messages'
    ];
    
    for (const collection of collections) {
      try {
        const items = await DatabaseService.getAll(collection);
        console.log(`📁 ${collection}: ${items.length} items`);
        
        if (items.length > 0 && items.length <= 5) {
          console.log(`   Items:`, items.map(item => {
            if (item && typeof item === 'object' && 'id' in item) {
              const name = (item as any).name || (item as any).senderName || 'N/A';
              return { id: item.id, name };
            }
            return { id: 'unknown', name: 'N/A' };
          }));
        }
      } catch (error) {
        console.log(`❌ Error getting ${collection}:`, error);
      }
    }
  } catch (error) {
    console.error('❌ Error showing database info:', error);
  }
}; 