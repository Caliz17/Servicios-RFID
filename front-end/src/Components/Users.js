import React, { useState, useEffect } from 'react';
import { connectToAPI } from '../api.js';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSquarePlus, faListCheck, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Alert from '../layouts/Alert.js'; // Asegúrate de que esta ruta sea correcta

const UserForm = () => {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [id_rol_usuario, setIdRolUsuario] = useState('');
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [editUserId, setEditUserId] = useState(null);
    const [alert, setAlert] = useState({ type: '', message: '', show: false });
    const [showPassword, setShowPassword] = useState(false);

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

    const fetchUsers = async () => {
        try {
            const response = await connectToAPI('/users');
            if (response.status) {
                setUsers(response.data);
            } else {
                console.error('Error al obtener los usuarios:', response.error);
            }
        } catch (error) {
            console.error('Error al conectar con la API:', error);
        }
    };

    useEffect(() => {
        fetchRoles();
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = editUserId ? `/updateUser/${editUserId}` : '/newUser';
        const method = editUserId ? 'PUT' : 'POST';
        const idRolUsuarioInt = parseInt(id_rol_usuario); // Convertir a entero
        try {
            const response = await connectToAPI(endpoint, { nombre_usuario: nombreUsuario, contrasena, id_rol_usuario: idRolUsuarioInt }, method);
            if (response.status) {
                setAlert({ type: 'success', message: 'Operación exitosa', show: true });
                fetchUsers();
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

    const handleEdit = (user) => {
        setNombreUsuario(user.nombre_usuario);
        setContrasena(user.contrasena);
        setIdRolUsuario(user.id_rol_usuario);
        setEditUserId(user.id_usuario);
    };

    const handleCancel = () => {
        setNombreUsuario('');
        setContrasena('');
        setIdRolUsuario('');
        setEditUserId(null);
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
                const response = await connectToAPI(`/deleteUser/${id}`, {}, 'DELETE');
                if (response.status) {
                    setAlert({ type: 'success', message: 'Usuario eliminado correctamente', show: true });
                    fetchUsers();
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

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-200 p-6">
            {alert.show && <Alert type={alert.type} message={alert.message} />}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-4/5 mb-6">
                <h2 className="text-2xl font-bold mb-6">
                    <FontAwesomeIcon icon={faSquarePlus} /> {editUserId ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h2>
                <div className="mb-4">
                    <label htmlFor="nombreUsuario" className="block text-gray-700 font-bold mb-2">
                        Nombre de Usuario
                    </label>
                    <input
                        type="text"
                        id="nombreUsuario"
                        value={nombreUsuario}
                        onChange={(e) => setNombreUsuario(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div className="mb-4 relative">
                    <label htmlFor="contrasena" className="block text-gray-700 font-bold mb-2">
                        Contraseña
                    </label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="contrasena"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                    <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute inset-y-0 right-0 px-3 py-2 focus:outline-none"
                    >
                        <FontAwesomeIcon className='mt-8' icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                </div>
                <div className="mb-4">
                    <label htmlFor="id_rol_usuario" className="block text-gray-700 font-bold mb-2">
                        Rol de Usuario
                    </label>
                    <select
                        id="id_rol_usuario"
                        value={id_rol_usuario}
                        onChange={(e) => setIdRolUsuario(e.target.value)} // Aquí, deberías establecer el ID del rol seleccionado
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    >
                        <option value="">Seleccione un rol</option>
                        {roles.map((role) => (
                            <option key={role.id_rol_usuario} value={role.id_rol_usuario}>
                                {role.nombre_rol}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
                        {editUserId ? 'Actualizar' : 'Enviar'}
                    </button>
                    <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:bg-gray-700 ml-2">
                        Cancelar
                    </button>
                </div>
            </form>
            <div className="bg-white p-6 rounded-lg shadow-lg w-4/5">
                <h2 className="text-2xl font-bold mb-4"><FontAwesomeIcon icon={faListCheck} /> Usuarios Registrados</h2>
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Nombre de Usuario</th>
                            <th className="px-4 py-2">Rol de Usuario</th>
                            <th className="px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id_usuario} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                <td className="border px-4 py-2 text-center">{user.id_usuario}</td>
                                <td className="border px-4 py-2">{user.nombre_usuario}</td>
                                <td className="border px-4 py-2">{user.nombre_rol}</td>
                                <td className="border px-4 py-2 text-center">
                                    <button onClick={() => handleEdit(user)} className="bg-blue-500 text-white px-2 py-1 mr-1 rounded-lg">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button onClick={() => handleDelete(user.id_usuario)} className="bg-red-500 text-white px-2 py-1 rounded-lg">
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

export default UserForm;
