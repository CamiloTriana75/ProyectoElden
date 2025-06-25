// Servicio de base de datos local usando IndexedDB
export class LocalDatabase {
  private dbName = 'EldenSportsDB';
  private version = 2;
  private db: IDBDatabase | null = null;

  // Inicializar la base de datos
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Crear object stores para cada tipo de dato
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('employees')) {
          db.createObjectStore('employees', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('positions')) {
          db.createObjectStore('positions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('documentTypes')) {
          db.createObjectStore('documentTypes', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('paymentMethods')) {
          db.createObjectStore('paymentMethods', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('sports')) {
          db.createObjectStore('sports', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('fields')) {
          db.createObjectStore('fields', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('timeSlots')) {
          db.createObjectStore('timeSlots', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('reservations')) {
          db.createObjectStore('reservations', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('messages')) {
          db.createObjectStore('messages', { keyPath: 'id' });
        }
      };
    });
  }

  // Métodos genéricos para CRUD
  async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async get<T>(storeName: string, id: string): Promise<T | undefined> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async add<T>(storeName: string, item: T): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(item);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async update<T>(storeName: string, item: T): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(item);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async delete(storeName: string, id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clear(storeName: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  // Métodos específicos para cada entidad
  async getUsers() { return this.getAll('users'); }
  async getEmployees() { return this.getAll('employees'); }
  async getPositions() { return this.getAll('positions'); }
  async getDocumentTypes() { return this.getAll('documentTypes'); }
  async getPaymentMethods() { return this.getAll('paymentMethods'); }
  async getSports() { return this.getAll('sports'); }
  async getFields() { return this.getAll('fields'); }
  async getTimeSlots() { return this.getAll('timeSlots'); }
  async getReservations() { return this.getAll('reservations'); }
  async getMessages() { return this.getAll('messages'); }

  async addUser(user: any) { return this.add('users', user); }
  async addEmployee(employee: any) { return this.add('employees', employee); }
  async addPosition(position: any) { return this.add('positions', position); }
  async addDocumentType(docType: any) { return this.add('documentTypes', docType); }
  async addPaymentMethod(method: any) { return this.add('paymentMethods', method); }
  async addSport(sport: any) { return this.add('sports', sport); }
  async addField(field: any) { return this.add('fields', field); }
  async addTimeSlot(timeSlot: any) { return this.add('timeSlots', timeSlot); }
  async addReservation(reservation: any) { return this.add('reservations', reservation); }
  async addMessage(message: any) { return this.add('messages', message); }

  async updateUser(user: any) { return this.update('users', user); }
  async updateEmployee(employee: any) { return this.update('employees', employee); }
  async updatePosition(position: any) { return this.update('positions', position); }
  async updateDocumentType(docType: any) { return this.update('documentTypes', docType); }
  async updatePaymentMethod(method: any) { return this.update('paymentMethods', method); }
  async updateSport(sport: any) { return this.update('sports', sport); }
  async updateField(field: any) { return this.update('fields', field); }
  async updateTimeSlot(timeSlot: any) { return this.update('timeSlots', timeSlot); }
  async updateReservation(reservation: any) { return this.update('reservations', reservation); }
  async updateMessage(message: any) { return this.update('messages', message); }

  async deleteUser(id: string) { return this.delete('users', id); }
  async deleteEmployee(id: string) { return this.delete('employees', id); }
  async deletePosition(id: string) { return this.delete('positions', id); }
  async deleteDocumentType(id: string) { return this.delete('documentTypes', id); }
  async deletePaymentMethod(id: string) { return this.delete('paymentMethods', id); }
  async deleteSport(id: string) { return this.delete('sports', id); }
  async deleteField(id: string) { return this.delete('fields', id); }
  async deleteTimeSlot(id: string) { return this.delete('timeSlots', id); }
  async deleteReservation(id: string) { return this.delete('reservations', id); }
  async deleteMessage(id: string) { return this.delete('messages', id); }

  // Inicializar datos por defecto
  async initializeDefaultData(defaultData: any): Promise<void> {
    try {
      // Verificar si ya hay datos
      const positions = await this.getPositions();
      if (positions.length === 0) {
        // Insertar datos por defecto
        for (const position of defaultData.positions) {
          await this.addPosition(position);
        }
        for (const docType of defaultData.documentTypes) {
          await this.addDocumentType(docType);
        }
        for (const method of defaultData.paymentMethods) {
          await this.addPaymentMethod(method);
        }
        for (const sport of defaultData.sports) {
          await this.addSport(sport);
        }
        for (const field of defaultData.fields) {
          await this.addField(field);
        }
        for (const timeSlot of defaultData.timeSlots) {
          await this.addTimeSlot(timeSlot);
        }
      }
    } catch (error) {
      console.error('Error initializing default data:', error);
    }
  }

  async clearMessages() { return this.clear('messages'); }
}

// Instancia singleton
export const db = new LocalDatabase(); 