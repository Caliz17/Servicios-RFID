import React, { useState, useEffect } from 'react';
import { connectToAPI } from '../api.js';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSquarePlus, faListCheck } from '@fortawesome/free-solid-svg-icons';
import Alert from '../layouts/Alert.js'; // Asegúrate de que esta ruta sea correcta

const UserRoles = () => {
  const [nombreRol, setNombreRol] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [roles, setRoles] = useState([]);
  const [editRoleId, setEditRoleId] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '', show: false });

  const fetchRoles = async () => {
    try {
      const response = await connectToAPI('/roles');
      if (response.status) {
        setRoles(response.data);
      } else {
        console.error('Error al obtener los roles:', response.error);
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = editRoleId ? `/updateRole/${editRoleId}` : '/newRoles';
    const method = editRoleId ? 'PUT' : 'POST';

    try {
      const response = await connectToAPI(endpoint, { nombre_rol: nombreRol, descripcion }, method);
      if (response.status) {
        setAlert({ type: 'success', message: 'Operación exitosa', show: true });
        fetchRoles();
        handleCancel();
      } else {
        console.error('Error al registrar/actualizar:', response.error);
        setAlert({ type: 'error', message: 'Error en la operación', show: true });
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
      setAlert({ type: 'error', message: 'Error al conectar con la API', show: true });
    }
  };

  const handleEdit = (role) => {
    setNombreRol(role.nombre_rol);
    setDescripcion(role.descripcion);
    setEditRoleId(role.id_rol_usuario);
  };

  const handleCancel = () => {
    setNombreRol('');
    setDescripcion('');
    setEditRoleId(null);
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esto',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo!',
      });
  
      if (result.isConfirmed) {
        const response = await connectToAPI(`/deleteRole/${id}`, {}, 'DELETE');
        if (response.status) {
          setAlert({ type: 'success', message: 'Rol de usuario eliminado correctamente', show: true });
          // Eliminar el rol de usuario de la lista
          setRoles(roles.filter(role => role.id_rol_usuario !== id));
        } else {
          console.error('Error al eliminar:', response.error);
          setAlert({ type: 'error', message: 'Error al eliminar', show: true });
        }
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
      setAlert({ type: 'error', message: 'Error al conectar con la API', show: true });
    }
  };
  

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-200 p-6">
      {alert.show && <Alert type={alert.type} message={alert.message} />}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-4/5 mb-6">
        <h2 className="text-2xl font-bold mb-6">
          <FontAwesomeIcon icon={faSquarePlus} /> {editRoleId ? 'Editar Rol de Usuario' : 'Nuevo Rol de Usuario'}
        </h2>
        <div className="mb-4">
          <label htmlFor="nombreRol" className="block text-gray-700 font-bold mb-2">
            Nombre del Rol
          </label>
          <input
            type="text"
            id="nombreRol"
            value={nombreRol}
            onChange={(e) => setNombreRol(e.target.value)}
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
        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
            {editRoleId ? 'Actualizar' : 'Enviar'}
          </button>
          <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:bg-gray-700 ml-2">
            Cancelar
          </button>
        </div>
      </form>
      <div className="bg-white p-6 rounded-lg shadow-lg w-4/5">
        <h2 className="text-2xl font-bold mb-4"><FontAwesomeIcon icon={faListCheck} /> Roles de Usuario Registrados</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Nombre del Rol</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, index) => (
              <tr key={role.id_rol_usuario} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                <td className="border px-4 py-2 text-center">{role.id_rol_usuario}</td>
                <td className="border px-4 py-2">{role.nombre_rol}</td>
                <td className="border px-4 py-2">{role.descripcion}</td>
                <td className="border px-4 py-2 text-center">
                  <button onClick={() => handleEdit(role)} className="bg-blue-500 text-white px-2 py-1 mr-1 rounded-lg">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDelete(role.id_rol_usuario)} className="bg-red-500 text-white px-2 py-1 rounded-lg">
                    <FontAwesomeIcon icon={faTrash} />
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

export default UserRoles;
