import React, { useState } from 'react';
import { connectToAPI } from '../api';

const Services = () => {
  const [nombre_servicio, setNombreServicio] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Realizar la solicitud POST a la API
      const response = await connectToAPI('/newTypeService', {
        nombre_servicio,
        descripcion
      });
      
      // Verificar si la solicitud fue exitosa
      if (response.status) {
        console.log('Registro exitoso');
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
    </div>
  );
};

export default Services;
