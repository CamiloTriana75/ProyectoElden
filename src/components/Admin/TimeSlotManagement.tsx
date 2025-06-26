import React, { useState } from 'react';
import { Plus, Edit, Trash2, Clock, DollarSign } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { TimeSlot as BaseTimeSlot, Field } from '../../types';

interface TimeSlotFormData {
  fieldId: string;
  date: string; // fecha exacta (YYYY-MM-DD)
  allDays: boolean;
  startTime: string;
  endTime: string;
  price: number;
  isActive: boolean;
  isAvailable: boolean;
}

// Extiende TimeSlot para el uso local
interface TimeSlot extends BaseTimeSlot {
  price: number;
  isAvailable: boolean;
  date?: string;
  allDays?: boolean;
}

export const TimeSlotManagement: React.FC = () => {
  const { timeSlots, fields, addTimeSlot, updateTimeSlot, deleteTimeSlot } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [formData, setFormData] = useState<TimeSlotFormData>({
    fieldId: '',
    date: '',
    allDays: false,
    startTime: '',
    endTime: '',
    price: 0,
    isActive: true,
    isAvailable: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    if (formData.allDays) {
      dataToSave.date = '';
    }
    if (editingSlot) {
      await updateTimeSlot(editingSlot.id!, dataToSave);
      setEditingSlot(null);
    } else {
      await addTimeSlot(dataToSave);
    }
    setFormData({
      fieldId: '',
      date: '',
      allDays: false,
      startTime: '',
      endTime: '',
      price: 0,
      isActive: true,
      isAvailable: true
    });
    setShowForm(false);
  };

  const handleEdit = (slot: BaseTimeSlot) => {
    const slotExt: TimeSlot = {
      ...slot,
      price: (slot as any).price || 0,
      isAvailable: (slot as any).isAvailable !== undefined ? (slot as any).isAvailable : true,
      date: (slot as any).date || '',
      allDays: (slot as any).allDays || false
    };
    setEditingSlot(slotExt);
    setFormData({
      fieldId: slotExt.fieldId,
      date: slotExt.date || '',
      allDays: slotExt.allDays || false,
      startTime: slotExt.startTime,
      endTime: slotExt.endTime,
      price: slotExt.price,
      isActive: slotExt.isActive,
      isAvailable: slotExt.isAvailable
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (window.confirm('¿Estás seguro de que quieres eliminar este horario?')) {
      await deleteTimeSlot(id);
    }
  };

  const getFieldName = (fieldId: string): string => {
    const field = fields.find(f => f.id === fieldId);
    return field ? field.name : 'Cancha no encontrada';
  };

  const groupedTimeSlots = timeSlots.reduce((acc, slot) => {
    const fieldName = getFieldName(slot.fieldId);
    if (!acc[fieldName]) {
      acc[fieldName] = [];
    }
    acc[fieldName].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Horarios</h2>
        <button
          onClick={() => {
            setEditingSlot(null);
            setFormData({
              fieldId: '',
              date: '',
              allDays: false,
              startTime: '',
              endTime: '',
              price: 0,
              isActive: true,
              isAvailable: true
            });
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar Horario
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">
            {editingSlot ? 'Editar Horario' : 'Nuevo Horario'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancha
              </label>
              <select
                required
                value={formData.fieldId}
                onChange={(e) => setFormData({ ...formData, fieldId: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Selecciona una cancha</option>
                {fields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha específica
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora de Inicio
                </label>
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora de Fin
                </label>
                <input
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio por Hora
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full pl-10 pr-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Horario activo
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAvailable"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">
                Horario disponible
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                {editingSlot ? 'Actualizar' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingSlot(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(groupedTimeSlots).map(([fieldName, slots]) => (
          <div key={fieldName} className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{fieldName}</h3>
            </div>
            <div className="p-6">
              {slots.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay horarios configurados para esta cancha</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {slots.map((slot) => {
                    const slotExt: TimeSlot = {
                      ...slot,
                      price: (slot as any).price || 0,
                      isAvailable: (slot as any).isAvailable !== undefined ? (slot as any).isAvailable : true
                    };
                    return (
                      <div
                        key={slotExt.id}
                        className={`p-4 border rounded-lg ${
                          slotExt.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">
                              {slotExt.startTime} - {slotExt.endTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="font-semibold text-green-600">${slotExt.price}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm px-2 py-1 rounded ${
                            slotExt.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {slotExt.isActive ? 'Activo' : 'Inactivo'}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(slotExt)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(slotExt.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {timeSlots.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay horarios configurados</h3>
          <p className="text-gray-500 mb-4">
            Configura los horarios disponibles para cada cancha deportiva
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Agregar Primer Horario
          </button>
        </div>
      )}
    </div>
  );
}; 