export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  documentType?: string;
  documentNumber?: string;
  role?: 'client' | 'employee' | 'admin';
}

export interface Sport {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Field {
  id: string;
  name: string;
  sportId: string;
  description: string;
  image: string;
  features: string[];
  pricePerHour: number;
}

export interface TimeSlot {
  id: string;
  fieldId: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
  dayOfWeek?: string; // 'monday', 'tuesday', etc. or 'all' for all days
  isActive: boolean; // Admin can enable/disable slots
}

export interface Reservation {
  id: string;
  userId: string;
  fieldId: string;
  sportName: string;
  fieldName: string;
  date: string;
  timeSlot: string;
  timeSlotId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
}

// New interfaces for employee management
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  position: string;
  phone: string;
  email?: string;
  createdAt: string;
}

export interface Position {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface DocumentType {
  id: string;
  name: string;
  code: string;
  createdAt: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  content: string;
  status: 'unread' | 'read';
  createdAt: string;
}