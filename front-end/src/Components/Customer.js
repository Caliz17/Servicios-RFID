import React, { useState, useEffect } from 'react';
import { connectToAPI } from '../api.js';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faThumbsDown, faThumbsUp, faSquarePlus, faListCheck } from '@fortawesome/free-solid-svg-icons';
import Alert from '../layouts/Alert.js';

const Clients = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo_electronico, setCorreoElectronico] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [perfil, setPerfil] = useState('');
  const [estado, setEstado] = useState(1);
  const [clients, setClients] = useState([]);
  const [editClientId, setEditClientId] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '', show: false });

  const fetchClients = async () => {
    try {
      const response = await connectToAPI('/clientes');
      if (response.status) {
        setClients(response.data);
      } else {
        setAlert({ type: 'error', message: 'Error al obtener los clientes', show: true });
        console.error('Error al obtener los clientes:', response.error);
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al conectar con la API', show: true });
      console.error('Error al conectar con la API:', error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = editClientId ? `/updateClientes/${editClientId}` : '/newClient';
    const method = editClientId ? 'PUT' : 'POST';

    try {
      const response = await connectToAPI(endpoint, { nombre, apellido, direccion, telefono, correo_electronico, contrasenia, perfil, estado }, method);
      if (response.status) {
        setAlert({ type: 'success', message: 'Operación exitosa', show: true });
        fetchClients();
        handleCancel();
      } else {
        setAlert({ type: 'error', message: 'Error en la operación', show: true });
        console.error('Error al registrar/actualizar:', response.error);
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al conectar con la API', show: true });
      console.error('Error al conectar con la API:', error);
    }
  };

  const handleEdit = (client) => {
    setNombre(client.nombre);
    setApellido(client.apellido);
    setDireccion(client.direccion);
    setTelefono(client.telefono);
    setCorreoElectronico(client.correo_electronico);
    setContrasenia(client.contrasenia);
    setPerfil(client.perfil);
    setEstado(client.estado);
    setEditClientId(client.id_cliente);
  };

  const handleCancel = () => {
    setNombre('');
    setApellido('');
    setDireccion('');
    setTelefono('');
    setCorreoElectronico('');
    setContrasenia('');
    setPerfil('');
    setEstado(1);
    setEditClientId(null);
  };

  const handleToggleClientStatus = async (id, currentState) => {
    try {
      const action = currentState === 1 ? 'desactivar' : 'activar';
      const endpoint = currentState === 1 ? `/downClient/${id}` : `/upClient/${id}`;
      const result = await Swal.fire({
        title: `¿Estás seguro que deseas ${action} al cliente?`,
        text: 'Puedes cambiar su estado nuevamente después',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `Sí, ${action}lo!`,
      });

      if (result.isConfirmed) {
        const response = await connectToAPI(endpoint, {}, 'PUT');
        if (response.status) {
          setAlert({ type: 'success', message: `Cliente ${action} correctamente`, show: true });
          fetchClients();
        } else {
          setAlert({ type: 'error', message: `Error al ${action}`, show: true });
          console.error(`Error al ${action}:`, response.error);
        }
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al conectar con la API', show: true });
      console.error('Error al conectar con la API:', error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-200 p-6">
      {alert.show && <Alert type={alert.type} message={alert.message} />}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-4/5 mb-6">
        <h2 className="text-2xl font-bold mb-6">
          <FontAwesomeIcon icon={faSquarePlus} /> {editClientId ? 'Editar Cliente' : 'Nuevo Cliente'}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-gray-700 font-bold mb-2">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="apellido" className="block text-gray-700 font-bold mb-2">
              Apellido
            </label>
            <input
              type="text"
              id="apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="direccion" className="block text-gray-700 font-bold mb-2">
              Dirección
            </label>
            <input
              type="text"
              id="direccion"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="telefono" className="block text-gray-700 font-bold mb-2">
              Teléfono
            </label>
            <input
              type="text"
              id="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="correo_electronico" className="block text-gray-700 font-bold mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="correo_electronico"
              value={correo_electronico}
              onChange={(e) => setCorreoElectronico(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="contrasenia" className="block text-gray-700 font-bold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="contrasenia"
              onChange={(e) => setContrasenia(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="perfil" className="block text-gray-700 font-bold mb-2">
              Perfil
            </label>
            <input
              type="text"
              id="perfil"
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="estado" className="block text-gray-700 font-bold mb-2">
              Estado
            </label>
            <select
              id="estado"
              value={estado}
              onChange={(e) => setEstado(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            >
              <option value={1}>Activo</option>
              <option value={0}>Inactivo</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
            {editClientId ? 'Actualizar' : 'Enviar'}
          </button>
          <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:bg-gray-700 ml-2">
            Cancelar
          </button>
        </div>
      </form>
      <div className="bg-white p-6 rounded-lg shadow-lg w-4/5">
        <h2 className="text-2xl font-bold mb-4"><FontAwesomeIcon icon={faListCheck} /> Clientes Registrados</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Apellido</th>
              <th className="px-4 py-2">Dirección</th>
              <th className="px-4 py-2">Teléfono</th>
              <th className="px-4 py-2">Correo Electrónico</th>
              <th className="px-4 py-2">Perfil</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <tr key={client.id_cliente} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                <td className="border px-4 py-2 text-center">{client.id_cliente}</td>
                <td className="border px-4 py-2">{client.nombre}</td>
                <td className="border px-4 py-2">{client.apellido}</td>
                <td className="border px-4 py-2">{client.direccion}</td>
                <td className="border px-4 py-2">{client.telefono}</td>
                <td className="border px-4 py-2">{client.correo_electronico}</td>
                <td className="border px-4 py-2">{client.perfil}</td>
                <td className="border px-4 py-2 text-center">{client.estado === 1 ? 'Activo' : 'Inactivo'}</td>
                <td className="border px-4 py-2 text-center">
                  <button onClick={() => handleEdit(client)} className="bg-blue-500 text-white px-2 py-1 mr-1 rounded-lg">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleToggleClientStatus(client.id_cliente, client.estado)} className={`px-2 py-1 rounded-lg ${client.estado === 1 ? 'bg-red-500' : 'bg-green-500'} text-white`}>
                    <FontAwesomeIcon icon={client.estado === 1 ? faThumbsDown : faThumbsUp} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clients;
