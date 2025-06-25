import React, { useState } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, CreditCard, ToggleLeft, ToggleRight } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { PaymentMethod } from '../../types';

interface PaymentMethodManagementProps {
  onBack: () => void;
}

export const PaymentMethodManagement: React.FC<PaymentMethodManagementProps> = ({ onBack }) => {
  const { paymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });

  const resetForm = () => {
    setFormData({ name: '', description: '', isActive: true });
    setEditingMethod(null);
    setShowForm(false);
  };

  const handleAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      name: method.name,
      description: method.description || '',
      isActive: method.isActive
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMethod) {
      updatePaymentMethod(editingMethod.id, formData);
    } else {
      addPaymentMethod(formData);
    }
    
    resetForm();
  };

  const handleDelete = (method: PaymentMethod) => {
    if (confirm(`¿Estás seguro de eliminar el método de pago "${method.name}"?`)) {
      deletePaymentMethod(method.id);
    }
  };

  const toggleActive = (method: PaymentMethod) => {
    updatePaymentMethod(method.id, { isActive: !method.isActive });
  };

  if (showForm) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={resetForm}
            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <h1 className="text-3xl font-bold text-white">
            {editingMethod ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
          </h1>
          <CreditCard className="w-8 h-8 text-green-400" />
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-3 text-lg">
                Nombre del Método
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej: Tarjeta de crédito"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-3 text-lg">
                Descripción (Opcional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Descripción del método de pago..."
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="text-white font-medium text-lg">Estado:</label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  formData.isActive 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {formData.isActive ? (
                  <>
                    <ToggleRight className="w-5 h-5" />
                    Activo
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-5 h-5" />
                    Inactivo
                  </>
                )}
              </button>
            </div>

            <div className="flex justify-center gap-4 pt-6">
              <button
                type="submit"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                {editingMethod ? 'Actualizar' : 'Crear Método'}
              </button>
              <button
                type="button"
                onClick={resetForm}
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
        <h1 className="text-3xl font-bold text-white">Métodos de Pago</h1>
        <CreditCard className="w-8 h-8 text-green-400" />
      </div>

      <div className="mb-8">
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Método de Pago
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-white font-medium">Nombre</th>
                <th className="px-6 py-4 text-left text-white font-medium">Descripción</th>
                <th className="px-6 py-4 text-left text-white font-medium">Estado</th>
                <th className="px-6 py-4 text-left text-white font-medium">Fecha Creación</th>
                <th className="px-6 py-4 text-right text-white font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {paymentMethods.map((method) => (
                <tr key={method.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{method.name}</td>
                  <td className="px-6 py-4 text-green-300">
                    {method.description || 'Sin descripción'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(method)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        method.isActive
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {method.isActive ? (
                        <>
                          <ToggleRight className="w-4 h-4" />
                          Activo
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4" />
                          Inactivo
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-green-300">
                    {new Date(method.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(method)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(method)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
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
    </div>
  );
};