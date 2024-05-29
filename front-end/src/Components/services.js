import React, { useState } from 'react';

const Services = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [nombreServicio, setNombreServicio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [servicios, setServicios] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario, como enviarlo a una API
    const nuevoServicio = {
      nombreServicio,
      descripcion
    };
    setServicios([...servicios, nuevoServicio]);
    setNombreServicio('');
    setDescripcion('');
    console.log('Nombre del Servicio:', nombreServicio);
    console.log('Descripción:', descripcion);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mb-6">
        <div className="mb-4">
          <label htmlFor="nombreServicio" className="block text-gray-700 font-bold mb-2">
            Nombre del Servicio
          </label>
          <input
            type="text"
            id="nombreServicio"
            value={nombreServicio}
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

      <table className="table-auto w-full max-w-md bg-white rounded-lg shadow-lg">
        <thead>
          <tr>
            <th className="px-4 py-2">Nombre del Servicio</th>
            <th className="px-4 py-2">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map((servicio, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{servicio.nombreServicio}</td>
              <td className="border px-4 py-2">{servicio.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Services;
