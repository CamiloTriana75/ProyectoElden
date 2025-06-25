import React, { useState } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Briefcase } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Position } from '../../types';

interface PositionManagementProps {
  onBack: () => void;
}

export const PositionManagement: React.FC<PositionManagementProps> = ({ onBack }) => {
  const { positions, addPosition, updatePosition, deletePosition } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingPosition(null);
    setShowForm(false);
  };

  const handleAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (position: Position) => {
    setEditingPosition(position);
    setFormData({
      name: position.name,
      description: position.description || ''
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPosition) {
      updatePosition(editingPosition.id, formData);
    } else {
      addPosition(formData);
    }
    
    resetForm();
  };

  const handleDelete = (position: Position) => {
    if (confirm(`¿Estás seguro de eliminar el cargo "${position.name}"?`)) {
      deletePosition(position.id);
    }
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
            {editingPosition ? 'Editar Cargo' : 'Nuevo Cargo'}
          </h1>
          <Briefcase className="w-8 h-8 text-green-400" />
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-3 text-lg">
                Nombre del Cargo
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej: Profesor de fútbol"
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
                placeholder="Descripción del cargo..."
              />
            </div>

            <div className="flex justify-center gap-4 pt-6">
              <button
                type="submit"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                {editingPosition ? 'Actualizar' : 'Crear Cargo'}
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
        <h1 className="text-3xl font-bold text-white">Gestión de Cargos</h1>
        <Briefcase className="w-8 h-8 text-green-400" />
      </div>

      <div className="mb-8">
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Cargo
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-white font-medium">Nombre</th>
                <th className="px-6 py-4 text-left text-white font-medium">Descripción</th>
                <th className="px-6 py-4 text-left text-white font-medium">Fecha Creación</th>
                <th className="px-6 py-4 text-right text-white font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {positions.map((position) => (
                <tr key={position.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{position.name}</td>
                  <td className="px-6 py-4 text-green-300">
                    {position.description || 'Sin descripción'}
                  </td>
                  <td className="px-6 py-4 text-green-300">
                    {new Date(position.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(position)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(position)}
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