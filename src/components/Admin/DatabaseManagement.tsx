import React, { useState } from 'react';
import { Database, RefreshCw, Info, AlertTriangle, CheckCircle, Wifi, Zap } from 'lucide-react';
import { resetDatabase, showDatabaseInfo, checkFirebaseStatus, forceInitializeData } from '../../utils/databaseUtils';

interface DatabaseManagementProps {
  onBack: () => void;
}

export const DatabaseManagement: React.FC<DatabaseManagementProps> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const handleResetDatabase = async () => {
    if (!window.confirm('¿Estás seguro de que quieres reinicializar la base de datos? Esto eliminará todos los datos existentes.')) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      await resetDatabase();
      setMessage({ type: 'success', text: 'Base de datos reinicializada correctamente' });
    } catch (error) {
      console.error('Error resetting database:', error);
      setMessage({ type: 'error', text: 'Error al reinicializar la base de datos' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowInfo = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      await showDatabaseInfo();
      setMessage({ type: 'info', text: 'Información de la base de datos mostrada en la consola' });
    } catch (error) {
      console.error('Error showing database info:', error);
      setMessage({ type: 'error', text: 'Error al mostrar información de la base de datos' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckFirebase = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const isConnected = await checkFirebaseStatus();
      if (isConnected) {
        setMessage({ type: 'success', text: 'Conexión a Firebase exitosa' });
      } else {
        setMessage({ type: 'error', text: 'Error de conexión a Firebase' });
      }
    } catch (error) {
      console.error('Error checking Firebase:', error);
      setMessage({ type: 'error', text: 'Error al verificar Firebase' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceInitialize = async () => {
    if (!window.confirm('¿Estás seguro de que quieres forzar la inicialización? Esto limpiará todos los datos existentes.')) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const success = await forceInitializeData();
      if (success) {
        setMessage({ type: 'success', text: 'Inicialización forzada completada exitosamente' });
      } else {
        setMessage({ type: 'error', text: 'Error en la inicialización forzada' });
      }
    } catch (error) {
      console.error('Error force initializing:', error);
      setMessage({ type: 'error', text: 'Error al forzar la inicialización' });
    } finally {
      setIsLoading(false);
    }
  };

  const getMessageIcon = () => {
    switch (message?.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
      default:
        return null;
    }
  };

  const getMessageColor = () => {
    switch (message?.type) {
      case 'success':
        return 'bg-green-900/20 border-green-500/50 text-green-300';
      case 'error':
        return 'bg-red-900/20 border-red-500/50 text-red-300';
      case 'info':
        return 'bg-blue-900/20 border-blue-500/50 text-blue-300';
      default:
        return '';
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          ← Volver
        </button>
        <h1 className="text-4xl font-bold text-white">Administración de Base de Datos</h1>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${getMessageColor()} flex items-center gap-3`}>
          {getMessageIcon()}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Verificar Firebase */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Wifi className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Verificar Firebase</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-300">
              Verifica la conexión a Firebase y el estado de la base de datos.
            </p>
            
            <button
              onClick={handleCheckFirebase}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Wifi className="w-5 h-5" />
              )}
              Verificar Conexión
            </button>
          </div>
        </div>

        {/* Información de la Base de Datos */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Info className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Información</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-300">
              Muestra información detallada sobre el estado actual de la base de datos, 
              incluyendo el número de registros en cada colección.
            </p>
            
            <button
              onClick={handleShowInfo}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Info className="w-5 h-5" />
              )}
              Ver Información
            </button>
          </div>
        </div>

        {/* Forzar Inicialización */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Forzar Inicialización</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <h3 className="text-yellow-300 font-medium mb-2">⚠️ Inicialización Forzada</h3>
                  <p className="text-yellow-200 text-sm">
                    Fuerza la creación de todos los datos por defecto, incluso si ya existen.
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleForceInitialize}
              disabled={isLoading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Zap className="w-5 h-5" />
              )}
              Forzar Inicialización
            </button>
          </div>
        </div>

        {/* Reinicializar Base de Datos */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <RefreshCw className="w-6 h-6 text-orange-400" />
            <h2 className="text-2xl font-bold text-white">Reinicializar</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-orange-900/20 border border-orange-500/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5" />
                <div>
                  <h3 className="text-orange-300 font-medium mb-2">⚠️ Advertencia</h3>
                  <p className="text-orange-200 text-sm">
                    Esta acción eliminará todos los datos existentes y creará nuevos datos por defecto. 
                    Esta operación no se puede deshacer.
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleResetDatabase}
              disabled={isLoading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
              Reinicializar Base de Datos
            </button>
          </div>
        </div>
      </div>

      {/* Información Adicional */}
      <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl font-bold text-white">Datos por Defecto</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-white font-medium mb-3">Usuarios de Prueba</h3>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-700/50 p-3 rounded">
                <div className="text-green-300 font-medium">Administrador</div>
                <div className="text-gray-300">Email: admin@elden.com</div>
                <div className="text-gray-300">Contraseña: admin123</div>
              </div>
              <div className="bg-gray-700/50 p-3 rounded">
                <div className="text-green-300 font-medium">Empleado</div>
                <div className="text-gray-300">Email: empleado@elden.com</div>
                <div className="text-gray-300">Contraseña: empleado123</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-3">Datos Incluidos</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• 4 Cargos de empleados</li>
              <li>• 6 Tipos de documento (incluyendo CC)</li>
              <li>• 5 Métodos de pago</li>
              <li>• 4 Deportes</li>
              <li>• 3 Canchas deportivas</li>
              <li>• 1 Empleado por defecto</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}; 