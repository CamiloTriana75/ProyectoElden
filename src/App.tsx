import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Home } from './components/Sections/Home';
import { SportSelection } from './components/Sections/SportSelection';
import { FieldList } from './components/Sections/FieldList';
import { FieldBooking } from './components/Sections/FieldBooking';
import { Reservations } from './components/Sections/Reservations';
import { Reports } from './components/Sections/Reports';
import { Contact } from './components/Sections/Contact';
import { Profile } from './components/Sections/Profile';
import { Settings } from './components/Sections/Settings';
import { Sport, Field } from './types';

type BookingFlow = 'sport-selection' | 'field-list' | 'field-booking';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState('inicio');
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Booking flow state
  const [bookingFlow, setBookingFlow] = useState<BookingFlow>('sport-selection');
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  const isAdmin = user?.role === 'admin';
  const isEmployee = user?.role === 'employee';

  // Redirect admin to reservations if they try to access other sections
  useEffect(() => {
    if (isAdmin && activeSection !== 'reservas') {
      setActiveSection('reservas');
    }
  }, [isAdmin, activeSection]);

  const handleSectionChange = (section: string) => {
    // Admin can only access reservations
    if (isAdmin && section !== 'reservas') {
      return;
    }
    
    // Employee can access home, reservations, reports, and settings
    if (isEmployee && !['inicio', 'reservas', 'reportes', 'ajustes'].includes(section)) {
      return;
    }
    
    setActiveSection(section);
    if (section === 'canchas') {
      setBookingFlow('sport-selection');
      setSelectedSport(null);
      setSelectedField(null);
    }
  };

  const handleSportSelect = (sport: Sport) => {
    setSelectedSport(sport);
    setBookingFlow('field-list');
  };

  const handleFieldSelect = (field: Field) => {
    setSelectedField(field);
    setBookingFlow('field-booking');
  };

  const handleBookingComplete = () => {
    setActiveSection('reservas');
    setBookingFlow('sport-selection');
    setSelectedSport(null);
    setSelectedField(null);
  };

  const handleBackToSportSelection = () => {
    setBookingFlow('sport-selection');
    setSelectedSport(null);
    setSelectedField(null);
  };

  const handleBackToFieldList = () => {
    setBookingFlow('field-list');
    setSelectedField(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-black">
        <Header />
        
        <div className="flex items-center justify-center pt-20">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            {authMode === 'login' ? (
              <LoginForm
                onSwitchToRegister={() => setAuthMode('register')}
                onClose={() => setShowAuth(false)}
              />
            ) : (
              <RegisterForm
                onSwitchToLogin={() => setAuthMode('login')}
                onClose={() => setShowAuth(false)}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    // Admin can only access reservations
    if (isAdmin) {
      return <Reservations />;
    }

    // Employee can access home, reservations, reports, and settings
    if (isEmployee) {
      switch (activeSection) {
        case 'inicio':
          return <Home />;
        case 'reservas':
          return <Reservations />;
        case 'reportes':
          return <Reports />;
        case 'ajustes':
          return <Settings />;
        default:
          return <Home />;
      }
    }

    // Regular users can access all sections except reports
    switch (activeSection) {
      case 'inicio':
        return <Home />;
      case 'canchas':
        switch (bookingFlow) {
          case 'sport-selection':
            return <SportSelection onSportSelect={handleSportSelect} />;
          case 'field-list':
            return (
              <FieldList
                sport={selectedSport!}
                onFieldSelect={handleFieldSelect}
                onBack={handleBackToSportSelection}
              />
            );
          case 'field-booking':
            return (
              <FieldBooking
                field={selectedField!}
                onBack={handleBackToFieldList}
                onBookingComplete={handleBookingComplete}
              />
            );
        }
        break;
      case 'reservas':
        return <Reservations />;
      case 'contacto':
        return <Contact />;
      case 'perfil':
        return <Profile />;
      case 'ajustes':
        return <Settings />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-black flex">
      <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
      
      <div className="flex-1">
        <main className="relative min-h-screen">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg')] bg-cover bg-center opacity-20"></div>
          <div className="relative z-10">
            {renderContent()}
          </div>
        </main>
        
        <footer className="relative z-10 bg-cyan-200/90 backdrop-blur-sm border-t border-gray-300 py-4">
          <div className="text-center">
            <p className="text-gray-800 font-medium">Contactos</p>
            <p className="text-gray-600 text-sm">copyright @2025</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;