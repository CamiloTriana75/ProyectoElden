import React, { useState } from 'react';
import { Bell, Lock, Globe, Moon, Sun, Smartphone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AdminSettings } from '../Admin/AdminSettings';
import { EmployeeManagement } from '../Admin/EmployeeManagement';
import { ClientManagement } from '../Admin/ClientManagement';
import { PositionManagement } from '../Admin/PositionManagement';
import { DocumentTypeManagement } from '../Admin/DocumentTypeManagement';
import { PaymentMethodManagement } from '../Admin/PaymentMethodManagement';
import { SportManagement } from '../Admin/SportManagement';
import { FieldManagement } from '../Admin/FieldManagement';
import { TimeSlotManagement } from '../Admin/TimeSlotManagement';
import { DatabaseManagement } from '../Admin/DatabaseManagement';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "../../services/firebase";

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    booking: true,
    promotions: false,
  });

  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('es');
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

   const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("");
    setErrorMessage("");

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Las contraseñas nuevas no coinciden.");
      return;
    }

    const user = auth.currentUser;
    if (!user || !user.email) {
      setErrorMessage("No se pudo verificar el usuario.");
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setStatusMessage("Contraseña actualizada correctamente.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setShowChangePasswordForm(false);
    } catch (error: any) {
      if (error.code === "auth/wrong-password") {
        setErrorMessage("La contraseña actual es incorrecta.");
      } else {
        setErrorMessage("Error al cambiar la contraseña.");
      }
    }
  };


  // If user is admin or employee, show admin panel
  if (user?.role === 'admin' || user?.role === 'employee') {
    if (currentSection === 'employees') {
      return <EmployeeManagement onBack={() => setCurrentSection(null)} />;
    }
    if (currentSection === 'clients') {
      return <ClientManagement onBack={() => setCurrentSection(null)} />;
    }
    if (currentSection === 'positions') {
      return <PositionManagement onBack={() => setCurrentSection(null)} />;
    }
    if (currentSection === 'document-types') {
      return <DocumentTypeManagement onBack={() => setCurrentSection(null)} />;
    }
    if (currentSection === 'payment-methods') {
      return <PaymentMethodManagement onBack={() => setCurrentSection(null)} />;
    }
    if (currentSection === 'sports') {
      return <SportManagement onBack={() => setCurrentSection(null)} />;
    }
    if (currentSection === 'fields') {
      return <FieldManagement onBack={() => setCurrentSection(null)} />;
    }
    if (currentSection === 'time-slots') {
      return <TimeSlotManagement />;
    }
    if (currentSection === 'database') {
      return <DatabaseManagement onBack={() => setCurrentSection(null)} />;
    }
    
    return <AdminSettings onSectionSelect={setCurrentSection} />;
  }

  // Regular user settings
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-8">Ajustes</h1>

      <div className="space-y-8">
        {/* Notifications */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Notificaciones</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Notificaciones por Email</h3>
                <p className="text-gray-400 text-sm">Recibir notificaciones en tu correo electrónico</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Notificaciones SMS</h3>
                <p className="text-gray-400 text-sm">Recibir mensajes de texto en tu teléfono</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Notificaciones Push</h3>
                <p className="text-gray-400 text-sm">Recibir notificaciones en tu navegador</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Confirmaciones de Reserva</h3>
                <p className="text-gray-400 text-sm">Notificaciones sobre tus reservas</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.booking}
                  onChange={(e) => setNotifications({ ...notifications, booking: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Promociones y Ofertas</h3>
                <p className="text-gray-400 text-sm">Recibir información sobre descuentos</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.promotions}
                  onChange={(e) => setNotifications({ ...notifications, promotions: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-red-400" />
            <h2 className="text-2xl font-bold text-white">Seguridad</h2>
          </div>

           <div className="space-y-4">
            {/* Change Password */}
            <button
              className="w-full text-left bg-gray-700/50 hover:bg-gray-600/50 p-4 rounded-lg transition-colors"
              onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}
            >
              <h3 className="text-white font-medium mb-1">Cambiar Contraseña</h3>
              <p className="text-gray-400 text-sm">Actualiza tu contraseña por seguridad</p>
            </button>
            {showChangePasswordForm && (
              <form
                onSubmit={handleChangePassword}
                className="bg-gray-800 p-4 rounded-lg space-y-4"
              >
                <div>
                  <label className="block text-white text-sm mb-1">
                    Contraseña Actual
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm mb-1">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm mb-1">
                    Confirmar Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded transition"
                >
                  Guardar Cambios
                </button>

                {statusMessage && (
                  <p className="text-green-400 text-sm">{statusMessage}</p>
                )}
                {errorMessage && (
                  <p className="text-red-400 text-sm">{errorMessage}</p>
                )}
              </form>
            )}

            <button className="w-full text-left bg-gray-700/50 hover:bg-gray-600/50 p-4 rounded-lg transition-colors">
              <h3 className="text-white font-medium mb-1">Autenticación de Dos Factores</h3>
              <p className="text-gray-400 text-sm">Añade una capa extra de seguridad a tu cuenta</p>
            </button>

            <button className="w-full text-left bg-gray-700/50 hover:bg-gray-600/50 p-4 rounded-lg transition-colors">
              <h3 className="text-white font-medium mb-1">Dispositivos Conectados</h3>
              <p className="text-gray-400 text-sm">Administra los dispositivos que acceden a tu cuenta</p>
            </button>
          </div>
        </div>

        
        


           
          </div>
        </div>

  );
};