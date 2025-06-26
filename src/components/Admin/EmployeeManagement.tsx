import React, { useState } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Users } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Employee } from '../../types';

interface EmployeeManagementProps {
  onBack: () => void;
}

export const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ onBack }) => {
  const { employees, positions, documentTypes, addEmployee, updateEmployee, deleteEmployee } = useData();
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit' | 'delete'>('list');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    documentType: '',
    documentNumber: '',
    positionId: '',
    phone: '',
    email: '',
    password: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      documentType: '',
      documentNumber: '',
      positionId: '',
      phone: '',
      email: '',
      password: ''
    });
    setSelectedEmployee(null);
  };

  const handleAdd = () => {
    setCurrentView('add');
    resetForm();
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      documentType: employee.documentType,
      documentNumber: employee.documentNumber,
      positionId: employee.positionId,
      phone: employee.phone,
      email: employee.email || '',
      password: ''
    });
    setCurrentView('edit');
  };

  const handleDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setCurrentView('delete');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentView === 'add') {
      addEmployee({
        name: formData.name,
        documentType: formData.documentType,
        documentNumber: formData.documentNumber,
        positionId: formData.positionId,
        phone: formData.phone,
        email: formData.email,
        isActive: true,
        password: formData.password
      });
    } else if (currentView === 'edit' && selectedEmployee) {
      updateEmployee(selectedEmployee.id, {
        name: formData.name,
        documentType: formData.documentType,
        documentNumber: formData.documentNumber,
        positionId: formData.positionId,
        phone: formData.phone,
        email: formData.email
      });
    }
    
    setCurrentView('list');
    resetForm();
  };

  const confirmDelete = () => {
    if (selectedEmployee) {
      deleteEmployee(selectedEmployee.id);
      setCurrentView('list');
      resetForm();
    }
  };

  const getDocumentTypeName = (id: string): string => {
    const docType = documentTypes.find((dt) => dt.id === id);
    return docType ? `${docType.code} - ${docType.name}` : id;
  };

  const getPositionName = (id: string): string => {
    const position = positions.find((p) => p.id === id);
    return position ? position.name : id;
  };

  if (currentView === 'add' || currentView === 'edit') {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setCurrentView('list')}
            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <h1 className="text-3xl font-bold text-white">
            {currentView === 'add' ? 'Ingresar Empleados' : 'Modificar Empleado'}
          </h1>
          <Users className="w-8 h-8 text-green-400" />
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-3 text-lg">
                  Nombre completo
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nombre completo"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-3 text-lg">
                  Tipo Documento
                </label>
                <div className="flex gap-2">
                  <select
                    required
                    value={formData.documentType}
                    onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar tipo</option>
                    {documentTypes.map(docType => (
                      <option key={docType.id} value={docType.id}>
                        {docType.code} - {docType.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <div className="text-red-400 text-sm font-medium">
                     
                    </div>
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-3 text-lg">
                  Numero de documento
                </label>
                <input
                  type="text"
                  required
                  value={formData.documentNumber}
                  onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="1113592521"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-3 text-lg">
                  Cargo
                </label>
                <div className="flex gap-2">
                  <select
                    required
                    value={formData.positionId}
                    onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar cargo</option>
                    {positions.map(position => (
                      <option key={position.id} value={position.id}>
                        {position.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <div className="text-red-400 text-sm font-medium">
                      
                    </div>
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-3 text-lg">
                  Telefono
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="3168134245"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-3 text-lg">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="empleado@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-3 text-lg">
                  Contraseña
                </label>
                <input
                  type="text"
                  required={currentView === 'add'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Contraseña para el empleado"
                />
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-6">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {currentView === 'add' ? 'Ingresar' : 'Actualizar'}
              </button>
              <button
                type="button"
                onClick={() => setCurrentView('list')}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (currentView === 'delete') {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setCurrentView('list')}
            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <h1 className="text-3xl font-bold text-white">Eliminar Empleado</h1>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
          <div className="mb-6">
            <Trash2 className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">¿Confirmar eliminación?</h2>
            <p className="text-gray-300">
              ¿Estás seguro de que deseas eliminar al empleado{' '}
              <span className="font-bold text-white">
                {selectedEmployee?.name}
              </span>?
            </p>
            <p className="text-red-400 text-sm mt-2">Esta acción no se puede deshacer.</p>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={confirmDelete}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Eliminar
            </button>
            <button
              onClick={() => setCurrentView('list')}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
        <h1 className="text-3xl font-bold text-white">Empleado</h1>
        <Users className="w-8 h-8 text-green-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <button
          onClick={handleAdd}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 text-center group"
        >
          <Plus className="w-12 h-12 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
          <div className="text-red-400 text-sm font-medium mb-2">
            
          </div>
          <h3 className="text-xl font-bold text-white">Ingresar</h3>
        </button>

        <button
          onClick={() => employees.length > 0 && handleEdit(employees[0])}
          disabled={employees.length === 0}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 text-center group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Edit2 className="w-12 h-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
          <div className="text-red-400 text-sm font-medium mb-2">
            
          </div>
          <h3 className="text-xl font-bold text-white">Modificar</h3>
        </button>

        <button
          onClick={() => employees.length > 0 && handleDelete(employees[0])}
          disabled={employees.length === 0}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 text-center group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-12 h-12 text-red-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
          <div className="text-red-400 text-sm font-medium mb-2">
           
          </div>
          <h3 className="text-xl font-bold text-white">Eliminar</h3>
        </button>

        <button className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 text-center group">
          <Users className="w-12 h-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
          <div className="text-red-400 text-sm font-medium mb-2">
           
          </div>
          <h3 className="text-xl font-bold text-white">Consultar</h3>
        </button>
      </div>

      {employees.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-medium">Nombre</th>
                  <th className="px-6 py-4 text-left text-white font-medium">Documento</th>
                  <th className="px-6 py-4 text-left text-white font-medium">Cargo</th>
                  <th className="px-6 py-4 text-left text-white font-medium">Teléfono</th>
                  <th className="px-6 py-4 text-right text-white font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white">
                      {employee.name}
                    </td>
                    <td className="px-6 py-4 text-green-300">
                      {getDocumentTypeName(employee.documentType)} - {employee.documentNumber}
                    </td>
                    <td className="px-6 py-4 text-green-300">
                      {getPositionName(employee.positionId)}
                    </td>
                    <td className="px-6 py-4 text-green-300">{employee.phone}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(employee)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(employee)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {employees.length === 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 text-center">
          <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No hay empleados registrados</h3>
          <p className="text-gray-400 mb-6">Comienza agregando el primer empleado al sistema</p>
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Agregar Empleado
          </button>
        </div>
      )}
    </div>
  );
};