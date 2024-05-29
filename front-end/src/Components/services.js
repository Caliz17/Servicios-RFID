import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const Services = () => {
  const [nombreServicio, setNombreServicio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [servicios, setServicios] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevoServicio = {
      nombreServicio,
      descripcion,
    };
    setServicios([...servicios, nuevoServicio]);
    setNombreServicio('');
    setDescripcion('');
  };

  const handleEditar = (index) => {
    // Aquí puedes implementar la lógica para editar un servicio
    console.log('Editando servicio en el índice:', index);
  };

  const handleEliminar = (index) => {
    // Aquí puedes implementar la lógica para eliminar un servicio
    const nuevosServicios = servicios.filter((servicio, i) => i !== index);
    setServicios(nuevosServicios);
    console.log('Eliminando servicio en el índice:', index);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-200 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl mb-6">
        {/* Cambia "max-w-xl" a la anchura máxima que desees para el formulario */}
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

      <table className="table-auto w-full max-w-xl bg-white rounded-lg shadow-lg">
        {/* Cambia "max-w-xl" a la anchura máxima que desees para la tabla */}
        <thead>
          <tr>
            <th className="px-4 py-2">No.</th> {/* Nueva columna para el número de servicio */}
            <th className="px-4 py-2">Nombre del Servicio</th>
            <th className="px-4 py-2">Descripción</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map((servicio, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{index + 1}</td> {/* Número de servicio */}
              <td className="border px-4 py-2">{servicio.nombreServicio}</td>
              <td className="border px-4 py-2">{servicio.descripcion}</td>
              <td className="border px-4 py-2">
                <button onClick={() => handleEditar(index)} className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">
                  <FontAwesomeIcon icon={faEdit} /> {/* Icono de editar */}
                </button>
                <button onClick={() => handleEliminar(index)} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                  <FontAwesomeIcon icon={faTrash} /> {/* Icono de eliminar */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Services;
