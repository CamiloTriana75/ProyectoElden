import React, { useState } from "react";
import {
  ArrowLeft,
  DollarSign,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Field } from "../../types";

interface FieldDetailsProps {
  field: Field;
  onBack: () => void;
}

export const FieldDetails: React.FC<FieldDetailsProps> = ({
  field,
  onBack,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (image: string) => setSelectedImage(image);
  const closeModal = () => setSelectedImage(null);

  const nextImage = () => {
    if (!selectedImage) return;
    const currentIndex = field.images.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % field.images.length;
    setSelectedImage(field.images[nextIndex]);
  };

  const prevImage = () => {
    if (!selectedImage) return;
    const currentIndex = field.images.indexOf(selectedImage);
    const prevIndex =
      (currentIndex - 1 + field.images.length) % field.images.length;
    setSelectedImage(field.images[prevIndex]);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gray-900 text-white">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
            <img
              src={field.image}
              alt={field.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <h1 className="text-3xl font-bold text-white">{field.name}</h1>
              <span className="text-green-400 font-bold text-lg flex items-center">
                <DollarSign size={20} className="mr-1" />
                {field.pricePerHour} / hora
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Descripción</h2>
            <p className="text-gray-300 leading-relaxed">{field.description}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo Gallery */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Galería</h2>
            {field.images && field.images.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {field.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Foto de la cancha ${idx + 1}`}
                    className="w-full h-24 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => openModal(img)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No hay fotos adicionales.</p>
            )}
          </div>

          {/* Characteristics */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Características
            </h2>
            <ul className="space-y-3">
              {field.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-200">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute -top-4 -right-4 bg-white text-black rounded-full p-2 z-10"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="Vista ampliada"
              className="w-full h-full object-contain"
            />
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 text-white p-2 rounded-full hover:bg-white/40"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 text-white p-2 rounded-full hover:bg-white/40"
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
