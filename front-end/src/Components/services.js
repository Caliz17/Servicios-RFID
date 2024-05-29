import React, { useState, useEffect } from 'react';
import { connectToAPI } from '../api';

const Services = () => {
  const [nombre_servicio, setNombreServicio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [services, setServices] = useState([]);

  const fetchServices = async () => {
    try {
      const response = await connectToAPI('/typeServices');
      if (response.status) {
        setServices(response.data);
      } else {
        console.error('Error al obtener los servicios:', response.error);
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await connectToAPI('/newTypeService', {
        nombre_servicio,
        descripcion
      }, 'POST');

      if (response.status) {
        console.log('Registro exitoso');
        fetchServices();
      } else {
        console.error('Error al registrar:', response.error);
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-200 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl mb-6">
        <div className="mb-4">
          <label htmlFor="nombre_servicio" className="block text-gray-700 font-bold mb-2">
            Nombre del Servicio
          </label>
          <input
            type="text"
            id="nombre_servicio"
            value={nombre_servicio}
            onChange={(e) => setNombreServicio(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="descripcion" className="block text-gray-700 font-bold mb-2">
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
          Enviar
        </button>
      </form>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4">Servicios Registrados</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Nombre del Servicio</th>
              <th className="px-4 py-2">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id_tipo_servicio}>
                <td className="border px-4 py-2">{service.id_tipo_servicio}</td>
                <td className="border px-4 py-2">{service.nombre_servicio}</td>
                <td className="border px-4 py-2">{service.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Services;
