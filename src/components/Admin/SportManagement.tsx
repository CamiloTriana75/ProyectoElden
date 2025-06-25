import React, { useState } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Trophy } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Sport } from '../../types';

interface SportManagementProps {
  onBack: () => void;
}

export const SportManagement: React.FC<SportManagementProps> = ({ onBack }) => {
  const { sports, addSport, updateSport, deleteSport } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingSport, setEditingSport] = useState<Sport | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    icon: '',
    color: 'bg-green-500'
  });

  const colorOptions = [
    { value: 'bg-green-500', label: 'Verde', color: '#22c55e' },
    { value: 'bg-blue-500', label: 'Azul', color: '#3b82f6' },
    { value: 'bg-red-500', label: 'Rojo', color: '#ef4444' },
    { value: 'bg-yellow-500', label: 'Amarillo', color: '#eab308' },
    { value: 'bg-purple-500', label: 'Morado', color: '#a855f7' },
    { value: 'bg-orange-500', label: 'Naranja', color: '#f97316' },
    { value: 'bg-pink-500', label: 'Rosa', color: '#ec4899' },
    { value: 'bg-indigo-500', label: 'Índigo', color: '#6366f1' }
  ];

  const resetForm = () => {
    setFormData({ id: '', name: '', icon: '', color: 'bg-green-500' });
    setEditingSport(null);
    setShowForm(false);
  };

  const handleAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (sport: Sport) => {
    setEditingSport(sport);
    setFormData({
      id: sport.id,
      name: sport.name,
      icon: sport.icon,
      color: sport.color
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSport) {
      updateSport(editingSport.id, {
        name: formData.name,
        icon: formData.icon,
        color: formData.color
      });
    } else {
      const newSport: Sport = {
        id: formData.id || formData.name.toLowerCase().replace(/\s+/g, '-'),
        name: formData.name,
        icon: formData.icon,
        color: formData.color
      };
      addSport(newSport);
    }
    
    resetForm();
  };

  const handleDelete = (sport: Sport) => {
    if (confirm(`¿Estás seguro de eliminar el deporte "${sport.name}"?`)) {
      deleteSport(sport.id);
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
            {editingSport ? 'Editar Deporte' : 'Nuevo Deporte'}
          </h1>
          <Trophy className="w-8 h-8 text-green-400" />
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!editingSport && (
              <div>
                <label className="block text-white font-medium mb-3 text-lg">
                  ID del Deporte
                </label>
                <input
                  type="text"
                  required
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ej: futbol, baloncesto"
                />
              </div>
            )}

            <div>
              <label className="block text-white font-medium mb-3 text-lg">
                Nombre del Deporte
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej: Fútbol"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-3 text-lg">
                Icono (Emoji)
              </label>
              <input
                type="text"
                required
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-2xl"
                placeholder="⚽"
                maxLength={2}
              />
              <p className="text-gray-400 text-sm mt-2">
                Usa un emoji que represente el deporte (ej: ⚽ 🏀 🎾 🏓)
              </p>
            </div>

            <div>
              <label className="block text-white font-medium mb-3 text-lg">
                Color
              </label>
              <div className="grid grid-cols-4 gap-3">
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: option.value })}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      formData.color === option.value
                        ? 'border-white bg-white/20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: option.color }}
                    ></div>
                    <span className="text-white text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-6">
              <button
                type="submit"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                {editingSport ? 'Actualizar' : 'Crear Deporte'}
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
        <h1 className="text-3xl font-bold text-white">Gestión de Deportes</h1>
        <Trophy className="w-8 h-8 text-green-400" />
      </div>

      <div className="mb-8">
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Deporte
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sports.map((sport) => (
          <div key={sport.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">{sport.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{sport.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-4 h-4 rounded-full ${sport.color}`}></div>
                  <span className="text-gray-400 text-sm">{sport.color}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleEdit(sport)}
                className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => handleDelete(sport)}
                className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};