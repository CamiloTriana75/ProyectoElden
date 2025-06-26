import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { DatabaseService } from '../../services/firebase';
import { Message } from '../../types';

export const Contact: React.FC = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    content: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<'read' | 'unread'>('read');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (user?.role === 'employee' || user?.role === 'admin') {
      DatabaseService.getAll<Message>('messages').then((msgs) =>
        setMessages(msgs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      );
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name || !form.email || !form.phone || !form.content) {
      setError('Por favor completa todos los campos.');
      return;
    }
    
    const messageData = {
      senderName: form.name,
      senderEmail: form.email,
      senderPhone: form.phone,
      content: form.content,
      status: 'unread' as const
    };
    
    try {
      await DatabaseService.add<Message>('messages', messageData);
      setSuccess('¡Mensaje enviado correctamente!');
      setForm({ ...form, content: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Error al enviar el mensaje.');
    }
  };

  const filteredMessages = messages.filter((msg) => {
    if (filter === 'read' && msg.status !== 'read') return false;
    if (filter === 'unread' && msg.status !== 'unread') return false;
    if (dateFilter && !msg.createdAt.startsWith(dateFilter)) return false;
    return true;
  });

  const markAsRead = async (msg: Message) => {
    if (msg.status === 'read' || !msg.id) return;
    try {
      await DatabaseService.update<Message>('messages', msg.id, { status: 'read' });
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, status: 'read' } : m)));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await DatabaseService.delete('messages', id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setSelectedMessage(null);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  if (user?.role === 'employee' || user?.role === 'admin') {
    return (
      <div className="min-h-screen flex flex-col bg-[url('/cancha-bg.jpg')] bg-cover bg-center">
        <div className="flex-1 flex flex-col justify-center items-center p-8">
          <h1 className="text-4xl font-bold text-white mb-6">Mensajes</h1>
          <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
            {/* Panel izquierdo: filtros y lista */}
            <div className="md:w-1/3 w-full">
              <div className="bg-black/60 rounded-xl p-6 mb-6">
                <div className="mb-4">
                  <span className="text-white font-bold block mb-2">Estado</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-green-300">
                      <input type="radio" checked={filter === 'read'} onChange={() => setFilter('read')} /> Leído
                    </label>
                    <label className="flex items-center gap-2 text-green-300">
                      <input type="radio" checked={filter === 'unread'} onChange={() => setFilter('unread')} /> Por Leer
                    </label>
                  </div>
                </div>
                <div>
                  <span className="text-white font-bold block mb-2">Filtrar por Fecha</span>
                  <input type="date" className="w-full px-2 py-1 rounded bg-gray-700 text-white" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
                </div>
              </div>
              <div className="bg-black/60 rounded-xl overflow-y-auto max-h-[400px]">
                {filteredMessages.length === 0 ? (
                  <div className="text-gray-300 text-center py-8">No hay mensajes para mostrar.</div>
                ) : (
                  <ul>
                    {filteredMessages.map((msg) => (
                      <li
                        key={msg.id}
                        className={`border-b border-gray-700 px-4 py-3 cursor-pointer flex items-center justify-between ${selectedMessage?.id === msg.id ? 'bg-green-900/40' : msg.status === 'unread' ? 'bg-gray-800/40' : ''}`}
                        onClick={() => { setSelectedMessage(msg); markAsRead(msg); }}
                      >
                        <span className="font-bold text-green-200 truncate w-32">{msg.senderName}</span>
                        <span className="text-gray-400 text-xs truncate w-28">{new Date(msg.createdAt).toLocaleString()}</span>
                        <span className={`ml-2 text-xs rounded px-2 py-1 ${msg.status === 'unread' ? 'bg-yellow-500 text-black' : 'bg-green-700 text-white'}`}>{msg.status === 'unread' ? 'Por leer' : 'Leído'}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {/* Panel derecho: detalle */}
            <div className="flex-1 flex flex-col justify-between bg-black/60 rounded-xl p-8 min-h-[400px]">
              {selectedMessage ? (
                <>
                  <div>
                    <div className="mb-2 text-xl text-white font-bold border-b border-gray-700 pb-2">{selectedMessage.senderName}</div>
                    <div className="mb-2 text-gray-300">Correo: <span className="text-green-200">{selectedMessage.senderEmail}</span></div>
                    <div className="mb-2 text-gray-300">Teléfono: <span className="text-green-200">{selectedMessage.senderPhone}</span></div>
                    <div className="mb-4 text-white">Mensaje:<br /><span className="block bg-gray-800/60 rounded p-4 mt-2 text-lg text-green-100 whitespace-pre-line">{selectedMessage.content}</span></div>
                    <div className="mb-2 text-gray-400 text-sm">Recibido: {new Date(selectedMessage.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex justify-center gap-8 mt-8">
                   
                    <button className="bg-red-600 text-white px-12 py-4 rounded-lg text-xl font-semibold hover:bg-red-700 shadow-lg" onClick={() => deleteMessage(selectedMessage.id!)}>Eliminar Mensaje</button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-xl">Selecciona un mensaje para ver el detalle</div>
              )}
              <div className="mt-8 border-t border-gray-700 pt-4 flex flex-col items-center">
                <div className="text-green-200 font-bold"></div>
                <div className="flex gap-4 mt-2">
                  <a href="#" className="text-green-400 hover:text-green-300"><i className="fab fa-whatsapp fa-2x"></i></a>
                  <a href="#" className="text-blue-400 hover:text-blue-300"><i className="fab fa-telegram fa-2x"></i></a>
                  <a href="#" className="text-black hover:text-gray-700"><i className="fab fa-x-twitter fa-2x"></i></a>
                  <a href="#" className="text-blue-600 hover:text-blue-500"><i className="fab fa-facebook fa-2x"></i></a>
                  <a href="#" className="text-pink-500 hover:text-pink-400"><i className="fab fa-instagram fa-2x"></i></a>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center text-cyan-200 mt-8 font-bold"><br /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Contacto</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Información de Contacto</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-green-400 mt-1" />
              <div>
                <h3 className="text-white font-medium mb-1">Teléfono</h3>
                <p className="text-green-200">+57 300 123 4567</p>
                <p className="text-green-200">+57 1 234 5678</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-green-400 mt-1" />
              <div>
                <h3 className="text-white font-medium mb-1">Correo Electrónico</h3>
                <p className="text-green-200">info@camposelden.com</p>
                <p className="text-green-200">reservas@camposelden.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-green-400 mt-1" />
              <div>
                <h3 className="text-white font-medium mb-1">Dirección</h3>
                <p className="text-green-200">Calle 123 # 45-67<br />Barrio Deportivo<br />Bogotá, Colombia</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-green-400 mt-1" />
              <div>
                <h3 className="text-white font-medium mb-1">Horarios de Atención</h3>
                <p className="text-green-200">Lunes a Viernes: 6:00 AM - 11:00 PM<br />Sábados y Domingos: 7:00 AM - 11:00 PM</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Envíanos un Mensaje</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nombre Completo</label>
              <input type="text" className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Tu nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Correo Electrónico</label>
              <input type="email" className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="tu@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono</label>
              <input type="tel" className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="+57 300 123 4567" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mensaje</label>
              <textarea rows={4} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none" placeholder="Escribe tu mensaje aquí..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}></textarea>
            </div>
            {error && <div className="text-red-400 text-center">{error}</div>}
            {success && <div className="text-green-400 text-center">{success}</div>}
            <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">Enviar Mensaje</button>
          </form>
        </div>
      </div>
    </div>
  );
};