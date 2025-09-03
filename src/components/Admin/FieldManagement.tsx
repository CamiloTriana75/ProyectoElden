import React, { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Building,
  Clock,
} from "lucide-react";
import { useData } from "../../contexts/DataContext";
import { Field, TimeSlot } from "../../types";
import { FieldDetails } from "../Sections/FieldDetails";

interface FieldManagementProps {
  onBack: () => void;
}

export const FieldManagement: React.FC<FieldManagementProps> = ({ onBack }) => {
  const {
    fields,
    sports,
    addField,
    updateField,
    deleteField,
    addTimeSlot,
    deleteTimeSlot,
    getFieldTimeSlots,
  } = useData();

  const [currentView, setCurrentView] = useState<
    "list" | "form" | "schedules" | "details"
  >("list");
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    sportId: "",
    description: "",
    image: "",
    images: [] as string[], // new for gallery
    features: [] as string[],
    pricePerHour: 0,
  });
  const [newFeature, setNewFeature] = useState("");

  // Schedule form data
  const [scheduleForm, setScheduleForm] = useState({
    startTime: "",
    endTime: "",
    price: 0,
    dayOfWeek: "all",
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      sportId: "",
      description: "",
      image: "",
      images: [],
      features: [],
      pricePerHour: 0,
    });
    setNewFeature("");
    setEditingField(null);
    setCurrentView("list");
  };

  const resetScheduleForm = () => {
    setScheduleForm({
      startTime: "",
      endTime: "",
      price: 0,
      dayOfWeek: "all",
      isActive: true,
    });
  };

  const handleAdd = () => {
    resetForm();
    setCurrentView("form");
  };

  const handleEdit = (field: Field) => {
    if (!field.id) return;
    setEditingField(field);
    setFormData({
      id: field.id,
      name: field.name,
      sportId: field.sportId,
      description: field.description,
      image: field.image,
      images: field.images || [],
      features: [...field.features],
      pricePerHour: field.pricePerHour,
    });
    setCurrentView("form");
  };


  const handleManageSchedules = (field: Field) => {
    setSelectedField(field);
    setCurrentView("schedules");
  };

  const handleViewDetails = (field: Field) => {
    setSelectedField(field);
    setCurrentView("details");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newField: Field = {
      id: editingField
        ? editingField.id
        : formData.id || `${formData.sportId}-${Date.now()}`,
      name: formData.name,
      sportId: formData.sportId,
      description: formData.description,
      image: formData.image,
      images: formData.images,
      features: formData.features,
      pricePerHour: formData.pricePerHour,
    };

    if (editingField && editingField.id) {
      updateField(editingField.id, newField);
    } else {
      addField(newField);
    }

    resetForm();
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedField || !selectedField.id) return;

    addTimeSlot({
      fieldId: selectedField.id,
      startTime: scheduleForm.startTime,
      endTime: scheduleForm.endTime,
      price: scheduleForm.price,
      dayOfWeek: scheduleForm.dayOfWeek,
      isAvailable: true,
      isActive: scheduleForm.isActive,
    });

    resetScheduleForm();
  };

  const handleDelete = (field: Field) => {
    if (field.id && confirm(`¿Estás seguro de eliminar la cancha "${field.name}"?`)) {
      deleteField(field.id);
    }
  };

  const handleDeleteTimeSlot = (timeSlotId: string) => {
    if (confirm("¿Estás seguro de eliminar este horario?")) {
      deleteTimeSlot(timeSlotId);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (feature: string) => {
    setFormData({
      ...formData,
      features: formData.features.filter((f) => f !== feature),
    });
  };


  const getSportName = (sportId: string) => {
    const sport = sports.find((s) => s.id === sportId);
    return sport ? sport.name : sportId;
  };

  const filteredFields = selectedSport
    ? fields.filter((f) => f.sportId === selectedSport)
    : fields;

  // --- VIEWS ---
  if (currentView === "details" && selectedField) {
    return (
      <FieldDetails
        field={selectedField}
        onBack={() => setCurrentView("list")}
      />
    );
  }

  if (currentView === "schedules" && selectedField && selectedField.id) {
    const fieldTimeSlots = getFieldTimeSlots(selectedField.id);
    return (
      <div className="p-6 space-y-4">
        <button
          onClick={() => setCurrentView("list")}
          className="flex items-center gap-2 text-blue-500 hover:underline"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <h2 className="text-xl font-bold">{selectedField.name} Schedules</h2>

        <form onSubmit={handleScheduleSubmit} className="space-y-2">
          <input
            type="time"
            value={scheduleForm.startTime}
            onChange={(e) =>
              setScheduleForm({ ...scheduleForm, startTime: e.target.value })
            }
          />
          <input
            type="time"
            value={scheduleForm.endTime}
            onChange={(e) =>
              setScheduleForm({ ...scheduleForm, endTime: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Price"
            value={scheduleForm.price}
            onChange={(e) =>
              setScheduleForm({
                ...scheduleForm,
                price: parseFloat(e.target.value),
              })
            }
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            Add Time Slot
          </button>
        </form>

        <ul>
          {fieldTimeSlots.map((slot: TimeSlot) => (
            <li key={slot.id} className="flex justify-between">
              {slot.startTime} - {slot.endTime} (${slot.price}){" "}
              <button
                onClick={() => slot.id && handleDeleteTimeSlot(slot.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }  // Schedule management view
  if (currentView === 'schedules' && selectedField && selectedField.id) {
    const fieldTimeSlots = getFieldTimeSlots(selectedField.id);

    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setCurrentView('list')}
            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <h1 className="text-3xl font-bold text-white">Horarios - {selectedField.name}</h1>
          <Clock className="w-8 h-8 text-green-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Schedule Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Agregar Horario</h3>
            
            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Hora Inicio
                  </label>
                  <input
                    type="time"
                    required
                    value={scheduleForm.startTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Hora Fin
                  </label>
                  <input
                    type="time"
                    required
                    value={scheduleForm.endTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Precio por Hora ($)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={scheduleForm.price}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, price: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="50"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Días de la Semana
                </label>
                <select
                  value={scheduleForm.dayOfWeek}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, dayOfWeek: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">Todos los días</option>
                  <option value="monday">Lunes</option>
                  <option value="tuesday">Martes</option>
                  <option value="wednesday">Miércoles</option>
                  <option value="thursday">Jueves</option>
                  <option value="friday">Viernes</option>
                  <option value="saturday">Sábado</option>
                  <option value="sunday">Domingo</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={scheduleForm.isActive}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, isActive: e.target.checked })}
                  className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                />
                <label htmlFor="isActive" className="text-white">
                  Horario activo
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Agregar Horario
              </button>
            </form>
          </div>

          {/* Current Schedules */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Horarios Configurados</h3>
            
            {fieldTimeSlots.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No hay horarios configurados</p>
              </div>
            ) : (
              <div className="space-y-3">
                {fieldTimeSlots.map((slot) => (
                  <div key={slot.id} className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">
                        {slot.startTime} - {slot.endTime}
                      </div>
                      <div className="text-green-300 text-sm">
                        ${slot.price}/hora • {slot.dayOfWeek === 'all' ? 'Todos los días' : slot.dayOfWeek}
                      </div>
                      <div className={`text-xs ${slot.isActive ? 'text-green-400' : 'text-red-400'}`}>
                        {slot.isActive ? 'Activo' : 'Inactivo'}
                      </div>
                    </div>
                    <button
                      onClick={() => slot.id && handleDeleteTimeSlot(slot.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Form view
  if (currentView === 'form') {
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
            {editingField ? 'Editar Cancha' : 'Nueva Cancha'}
          </h1>
          <Building className="w-8 h-8 text-green-400" />
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!editingField && (
              <div>
                <label className="block text-white font-medium mb-3 text-lg">
                  ID de la Cancha
                </label>
                <input
                  type="text"
                  required
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ej: futbol-1"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-3 text-lg">
                  Nombre de la Cancha
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ej: Cancha Sintética 1"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-3 text-lg">
                  Deporte
                </label>
                <select
                  required
                  value={formData.sportId}
                  onChange={(e) => setFormData({ ...formData, sportId: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Seleccionar deporte</option>
                  {sports.map(sport => (
                    <option key={sport.id} value={sport.id}>
                      {sport.icon} {sport.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-3 text-lg">
                Descripción
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Descripción de la cancha..."
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-3 text-lg">
                URL de la Imagen
              </label>
              <input
                type="url"
                required
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://images.pexels.com/..."
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-3 text-lg">
                Características
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ej: Césped artificial"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(feature)}
                      className="hover:bg-green-700 rounded-full p-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-3 text-lg">
                Precio por Hora ($)
              </label>
              <input
                type="number"
                required
                min="0"
                step="1"
                value={formData.pricePerHour}
                onChange={(e) => setFormData({ ...formData, pricePerHour: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="50"
              />
            </div>

            <div className="flex justify-center gap-4 pt-6">
              <button
                type="submit"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                {editingField ? 'Actualizar' : 'Crear Cancha'}
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

  // Main list view
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
        <h1 className="text-3xl font-bold text-white">Gestión de Canchas</h1>
        <Building className="w-8 h-8 text-green-400" />
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Cancha
        </button>

        <select
          value={selectedSport}
          onChange={(e) => setSelectedSport(e.target.value)}
          className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500"
        >
          <option value="">Todos los deportes</option>
          {sports.map(sport => (
            <option key={sport.id} value={sport.id}>
              {sport.icon} {sport.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFields.map((field) => (
          <div key={field.id} className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/20 transition-all duration-300">
            <div className="aspect-video bg-gray-800 overflow-hidden">
              <img
                src={field.image}
                alt={field.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3
                  className="text-xl font-bold text-white cursor-pointer hover:underline"
                  onClick={() => handleViewDetails(field)}
                >
                  {field.name}
                </h3>
                <span className="text-green-400 font-bold">${field.pricePerHour}/hora</span>
              </div>
              
              <p className="text-gray-300 text-sm mb-3">{getSportName(field.sportId)}</p>
              <p className="text-gray-400 text-sm mb-4">{field.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {field.features.slice(0, 3).map((feature, index) => (
                  <span key={index} className="bg-green-600/20 text-green-300 px-2 py-1 rounded text-xs">
                    {feature}
                  </span>
                ))}
                {field.features.length > 3 && (
                  <span className="text-gray-400 text-xs">+{field.features.length - 3} más</span>
                )}
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleManageSchedules(field)}
                  className="bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 transition-colors flex items-center gap-1"
                >
                  <Clock className="w-4 h-4" />
                  Horarios
                </button>
                <button
                  onClick={() => handleEdit(field)}
                  className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(field)}
                  className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFields.length === 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 text-center">
          <Building className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            {selectedSport ? `No hay canchas de ${getSportName(selectedSport)}` : 'No hay canchas registradas'}
          </h3>
          <p className="text-gray-400 mb-6">
            {selectedSport ? 'Agrega canchas para este deporte' : 'Comienza agregando la primera cancha al sistema'}
          </p>
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Agregar Cancha
          </button>
        </div>
      )}
    </div>
  );
};
