import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { Sidebar } from "./components/Layout/Sidebar";
import { Header } from "./components/Layout/Header";
import { LoginForm } from "./components/Auth/LoginForm";
import { RegisterForm } from "./components/Auth/RegisterForm";
import { Home } from "./components/Sections/Home";
import { SportSelection } from "./components/Sections/SportSelection";
import { FieldList } from "./components/Sections/FieldList";
import { FieldBooking } from "./components/Sections/FieldBooking";
import { FieldDetails } from "./components/Sections/FieldDetails";
import { Reservations } from "./components/Sections/Reservations";
import { TournamentList } from "./components/Sections/TournamentList";
import { Reports } from "./components/Sections/Reports";
import { Contact } from "./components/Sections/Contact";
import { Profile } from "./components/Sections/Profile";
import { Settings } from "./components/Sections/Settings";
import { Sport, Field } from "./types";
import { Menu } from "lucide-react";

type BookingFlow =
  | "sport-selection"
  | "field-list"
  | "field-booking"
  | "field-details";

function AppContent() {
  const { user, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState("inicio");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Booking flow state
  const [bookingFlow, setBookingFlow] =
    useState<BookingFlow>("sport-selection");
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = user?.role === "admin";
  const isEmployee = user?.role === "employee";

  // Redirect admin to reservations if they try to access other sections
  useEffect(() => {
    if (isAdmin && activeSection !== "reservas") {
      setActiveSection("reservas");
    }
  }, [isAdmin, activeSection]);

  const handleSectionChange = (section: string) => {
    // Admin can only access reservations
    if (isAdmin && section !== "reservas") {
      return;
    }

    // Employee puede acceder a inicio, reservas, reportes, contacto y ajustes
    if (
      isEmployee &&
      !["inicio", "reservas", "reportes", "contacto", "ajustes"].includes(
        section
      )
    ) {
      return;
    }

    setActiveSection(section);
    if (section === "canchas") {
      setBookingFlow("sport-selection");
      setSelectedSport(null);
      setSelectedField(null);
    }
  };

  const handleSportSelect = (sport: Sport) => {
    setSelectedSport(sport);
    setBookingFlow("field-list");
  };

  const handleFieldSelect = (field: Field) => {
    setSelectedField(field);
    setBookingFlow("field-booking");
  };

  const handleViewFieldDetails = (field: Field) => {
    setSelectedField(field);
    setBookingFlow("field-details");
  };

  const handleBookingComplete = () => {
    setActiveSection("reservas");
    setBookingFlow("sport-selection");
    setSelectedSport(null);
    setSelectedField(null);
  };

  const handleBackToSportSelection = () => {
    setBookingFlow("sport-selection");
    setSelectedSport(null);
    setSelectedField(null);
  };

  const handleBackToFieldList = () => {
    setBookingFlow("field-list");
    setSelectedField(null);
  };

  const handleBackToFieldListFromDetails = () => {
    setBookingFlow("field-list");
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
            {authMode === "login" ? (
              <LoginForm
                onSwitchToRegister={() => setAuthMode("register")}
                onClose={() => {}}
              />
            ) : (
              <RegisterForm
                onSwitchToLogin={() => setAuthMode("login")}
                onClose={() => {}}
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
      return <Reservations onSectionChange={handleSectionChange} />;
    }

    // Employee can access home, reservations, reports, and settings
    if (isEmployee) {
      switch (activeSection) {
        case "inicio":
          return <Home onSectionChange={handleSectionChange} />;
        case "reservas":
          return <Reservations onSectionChange={handleSectionChange} />;
        case "reportes":
          return <Reports />;
        case "ajustes":
          return <Settings />;
        case "contacto":
          return <Contact />;
        default:
          return <Home onSectionChange={handleSectionChange} />;
      }
    }

    // Regular users can access all sections except reports
    switch (activeSection) {
      case "inicio":
        return <Home onSectionChange={handleSectionChange} />;
      case "canchas":
        switch (bookingFlow) {
          case "sport-selection":
            return <SportSelection onSportSelect={handleSportSelect} />;
          case "field-list":
            return (
              <FieldList
                sport={selectedSport!}
                onFieldSelect={handleFieldSelect}
                onViewDetails={handleViewFieldDetails}
                onBack={handleBackToSportSelection}
              />
            );
          case "field-booking":
            return (
              <FieldBooking
                field={selectedField!}
                onBack={handleBackToFieldList}
                onBookingComplete={handleBookingComplete}
              />
            );
          case "field-details":
            return (
              <FieldDetails
                field={selectedField!}
                onBack={handleBackToFieldListFromDetails}
              />
            );
        }
        break;
      case "reservas":
        return <Reservations onSectionChange={handleSectionChange} />;
      case "torneos":
        return <TournamentList />;
      case "contacto":
        return <Contact />;
      case "perfil":
        return <Profile />;
      case "ajustes":
        return <Settings />;
      default:
        return <Home onSectionChange={handleSectionChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-black flex">
      <div className="hidden md:flex">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
      </div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className={`w-64 h-full bg-gray-900/95 backdrop-blur-sm flex flex-col transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            style={{ willChange: "transform" }}
          >
            <Sidebar
              activeSection={activeSection}
              onSectionChange={(section) => {
                setSidebarOpen(false);
                handleSectionChange(section);
              }}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
          <div
            className="flex-1 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}
      <div className="flex-1">
        <main className="relative min-h-screen">
          <button
            className="absolute top-4 left-4 z-40 md:hidden bg-gray-900/80 p-2 rounded-lg text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg')] bg-cover bg-center opacity-10 sm:opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-black/95 sm:from-gray-900/70 sm:via-gray-900/60 sm:to-black/80"></div>
          <div className="relative z-10">{renderContent()}</div>
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
