import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Calendar, DollarSign, TrendingUp, User, Mail, Phone, FileText, Search } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { DatabaseService, User as UserType } from '../../services/firebase';

interface ClientManagementProps {
  onBack: () => void;
}

export const ClientManagement: React.FC<ClientManagementProps> = ({ onBack }) => {
  const { reservations } = useData();
  const [clients, setClients] = useState<UserType[]>([]);
  const [filteredClients, setFilteredClients] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const allUsers = await DatabaseService.getUsers();
        // Filtrar solo clientes (role: 'client')
        const clientUsers = allUsers.filter(user => user.role === 'client');
        setClients(clientUsers);
        setFilteredClients(clientUsers);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading clients:', error);
        setIsLoading(false);
      }
    };

    loadClients();
  }, []);

  useEffect(() => {
    const filtered = clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const getClientStats = (clientId: string) => {
    const clientReservations = reservations.filter(res => res.userId === clientId);
    const totalReservations = clientReservations.length;
    const confirmedReservations = clientReservations.filter(res => res.status === 'confirmed').length;
    const pendingReservations = clientReservations.filter(res => res.status === 'pending').length;
    const cancelledReservations = clientReservations.filter(res => res.status === 'cancelled').length;
    const totalSpent = clientReservations
      .filter(res => res.status === 'confirmed')
      .reduce((sum, res) => sum + res.totalPrice, 0);

    return {
      totalReservations,
      confirmedReservations,
      pendingReservations,
      cancelledReservations,
      totalSpent
    };
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-full lg:max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="bg-gray-700/50 hover:bg-gray-600/50 p-3 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white">Gestión de Clientes</h1>
          <p className="text-green-300 text-sm sm:text-base">
            Administrar clientes registrados y ver sus estadísticas
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-green-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-green-600/20 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-green-300 text-sm">Total Clientes</p>
              <p className="text-white text-2xl font-bold">{clients.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-600/20 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-blue-300 text-sm">Reservas Totales</p>
              <p className="text-white text-2xl font-bold">
                {reservations.filter(r => r.userId && clients.some(c => c.id === r.userId)).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-600/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-yellow-400" />
            <div>
              <p className="text-yellow-300 text-sm">Reservas Confirmadas</p>
              <p className="text-white text-2xl font-bold">
                {reservations.filter(r => r.status === 'confirmed' && r.userId && clients.some(c => c.id === r.userId)).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-600/20 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-purple-300 text-sm">Ingresos Totales</p>
              <p className="text-white text-2xl font-bold">
                ${reservations
                  .filter(r => r.status === 'confirmed' && r.userId && clients.some(c => c.id === r.userId))
                  .reduce((sum, r) => sum + r.totalPrice, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm bg-transparent">
            <thead className="bg-gray-800/80">
              <tr>
                <th className="px-4 sm:px-6 py-4 text-left text-white font-medium">Cliente</th>
                <th className="px-4 sm:px-6 py-4 text-left text-white font-medium">Contacto</th>
                <th className="px-4 sm:px-6 py-4 text-left text-white font-medium">Documento</th>
                <th className="px-4 sm:px-6 py-4 text-left text-white font-medium">Fecha Registro</th>
                <th className="px-4 sm:px-6 py-4 text-left text-white font-medium">Reservas</th>
                <th className="px-4 sm:px-6 py-4 text-left text-white font-medium">Total Gastado</th>
                <th className="px-4 sm:px-6 py-4 text-left text-white font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredClients.map((client) => {
                const stats = getClientStats(client.id!);
                return (
                  <tr key={client.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-600/20 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{client.name}</p>
                          <p className="text-green-300 text-xs">ID: {client.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-green-300">
                          <Mail className="w-3 h-3" />
                          <span className="text-xs">{client.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-300">
                          <Phone className="w-3 h-3" />
                          <span className="text-xs">{client.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2 text-green-300">
                        <FileText className="w-3 h-3" />
                        <span className="text-xs">
                          {client.documentType || 'N/A'} - {client.documentNumber || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-green-300 text-xs">
                      {formatDate(client.createdAt)}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-xs">Total: {stats.totalReservations}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 text-xs">✓ {stats.confirmedReservations}</span>
                          <span className="text-yellow-400 text-xs">⏳ {stats.pendingReservations}</span>
                          <span className="text-red-400 text-xs">✗ {stats.cancelledReservations}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-green-300 font-medium">
                        ${stats.totalSpent.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        stats.totalReservations > 0 
                          ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                          : 'bg-gray-600/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {stats.totalReservations > 0 ? 'Activo' : 'Inactivo'}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              {clients.length === 0 
                ? 'No hay clientes registrados'
                : 'No hay clientes que coincidan con la búsqueda'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 