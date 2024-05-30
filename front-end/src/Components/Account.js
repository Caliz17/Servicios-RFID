import React, { useState, useEffect } from 'react';
import { connectToAPI } from '../api.js';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faThumbsDown, faThumbsUp, faSquarePlus, faListCheck } from '@fortawesome/free-solid-svg-icons';
import Alert from '../layouts/Alert.js'; // Asegúrate de que esta ruta sea correcta

const AccountForm = () => {
    const [numeroCuenta, setNumeroCuenta] = useState('');
    const [idCliente, setIdCliente] = useState('');
    const [idTipoCuenta, setIdTipoCuenta] = useState('');
    const [saldo, setSaldo] = useState('');
    const [estado, setEstado] = useState('1');
    const [clientes, setClientes] = useState([]);
    const [tipoCuentas, setTipoCuentas] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [editAccountId, setEditAccountId] = useState(null);
    const [alert, setAlert] = useState({ type: '', message: '', show: false });

    const fetchClientes = async () => {
        try {
            const response = await connectToAPI('/clientes');
            if (response.status) {
                setClientes(response.data);
            } else {
                console.error('Error al obtener los clientes:', response.error);
            }
        } catch (error) {
            console.error('Error al conectar con la API:', error);
        }
    };

    const fetchTipoCuentas = async () => {
        try {
            const response = await connectToAPI('/accountTypes');
            if (response.status) {
                setTipoCuentas(response.data);
            } else {
                console.error('Error al obtener los tipos de cuenta:', response.error);
            }
        } catch (error) {
            console.error('Error al conectar con la API:', error);
        }
    };

    const fetchAccounts = async () => {
        try {
            const response = await connectToAPI('/cuentas');
            if (response.status) {
                setAccounts(response.data);
            } else {
                console.error('Error al obtener las cuentas:', response.error);
            }
        } catch (error) {
            console.error('Error al conectar con la API:', error);
        }
    };

    useEffect(() => {
        fetchClientes();
        fetchTipoCuentas();
        fetchAccounts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = editAccountId ? `/updateCuenta/${editAccountId}` : '/newCuenta';
        const method = editAccountId ? 'PUT' : 'POST';

        try {
            const data = {
                numero_cuenta: numeroCuenta,
                id_cliente: parseInt(idCliente, 10), // Convertir a entero
                id_tipo_cuenta: parseInt(idTipoCuenta, 10), // Convertir a entero
                saldo: parseFloat(saldo), // Convertir a float
                estado: parseInt(estado, 10) // Convertir a entero
            };
            const response = await connectToAPI(endpoint, data, method);
            if (response.status) {
                setAlert({ type: 'success', message: 'Operación exitosa', show: true });
                fetchAccounts();
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

    const handleEdit = (account) => {
        setNumeroCuenta(account.numero_cuenta || '');
        setIdCliente(account.id_cliente ? account.id_cliente.toString() : '');
        setIdTipoCuenta(account.id_tipo_cuenta ? account.id_tipo_cuenta.toString() : '');
        setSaldo(account.saldo ? account.saldo.toString() : '');
        setEstado(account.estado ? account.estado.toString() : '1');
        setEditAccountId(account.id_cuenta);
    };

    const handleCancel = () => {
        setNumeroCuenta('');
        setIdCliente('');
        setIdTipoCuenta('');
        setSaldo('');
        setEstado('1');
        setEditAccountId(null);
    };

    const handleToggleAccountStatus = async (id, currentState) => {
        try {
            const action = currentState === 1 ? 'desactivar' : 'activar';
            const endpoint = currentState === 1 ? `/downCuenta/${id}` : `/upCuenta/${id}`;
            const result = await Swal.fire({
                title: `¿Estás seguro que deseas ${action} la cuenta?`,
                text: 'Puedes cambiar su estado nuevamente después',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: `Sí, ${action}la!`,
            });

            if (result.isConfirmed) {
                const response = await connectToAPI(endpoint, {}, 'PUT');
                if (response.status) {
                    setAlert({ type: 'success', message: `Cuenta ${action} correctamente`, show: true });
                    fetchAccounts();
                } else {
                    console.error(`Error al ${action}:`, response.error);
                    setAlert({ type: 'error', message: `Error al ${action}`, show: true });
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
                    <FontAwesomeIcon icon={faSquarePlus} /> {editAccountId ? 'Editar Cuenta' : 'Nueva Cuenta'}
                </h2>
                <div className="mb-4">
                    <label htmlFor="numeroCuenta" className="block text-gray-700 font-bold mb-2">
                        Número de Cuenta
                    </label>
                    <input
                        type="text"
                        id="numeroCuenta"
                        value={numeroCuenta}
                        onChange={(e) => setNumeroCuenta(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="idCliente" className="block text-gray-700 font-bold mb-2">
                        Cliente
                    </label>
                    <select
                        id="idCliente"
                        value={idCliente}
                        onChange={(e) => setIdCliente(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    >
                        <option value="">Seleccione un cliente</option>
                        {clientes.map((cliente) => (
                            <option key={cliente.id_cliente} value={cliente.id_cliente}>
                                {cliente.nombre} {cliente.apellido}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="idTipoCuenta" className="block text-gray-700 font-bold mb-2">
                        Tipo de Cuenta
                    </label>
                    <select
                        id="idTipoCuenta"
                        value={idTipoCuenta}
                        onChange={(e) => setIdTipoCuenta(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    >
                        <option value="">Seleccione un tipo de cuenta</option>
                        {tipoCuentas.map((tipoCuenta) => (
                            <option key={tipoCuenta.id_tipo_cuenta} value={tipoCuenta.id_tipo_cuenta}>
                                {tipoCuenta.nombre_tipo_cuenta}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="saldo" className="block text-gray-700 font-bold mb-2">
                        Saldo
                    </label>
                    <input
                        type="number"
                        id="saldo"
                        value={saldo}
                        onChange={(e) => setSaldo(e.target.value)}
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
                        onChange={(e) => setEstado(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    >
                        <option value="1">Activo</option>
                        <option value="0">Inactivo</option>
                    </select>
                </div>
                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        {editAccountId ? 'Actualizar' : 'Registrar'}
                    </button>
                    {editAccountId && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
            <div className="bg-white p-6 rounded-lg shadow-lg w-4/5">
                <h2 className="text-2xl font-bold mb-6">
                    <FontAwesomeIcon icon={faListCheck} /> Listado de Cuentas
                </h2>
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                        <th className="py-2">No.</th>
                            <th className="py-2">Número de Cuenta</th>
                            <th className="py-2">Cliente</th>
                            <th className="py-2">Tipo de Cuenta</th>
                            <th className="py-2">Saldo</th>
                            <th className="py-2">Estado</th>
                            <th className="py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((account, index) => (
                            <tr key={account.id_cuenta} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                <td className='py-2'>{account.id_cuenta}</td>
                                <td className="py-2">{account.numero_cuenta}</td>
                                <td className="py-2">{`${account.nombre_cliente}`}</td>
                                <td className="py-2">{account.nombre_tipo_cuenta}</td>
                                <td className="py-2">{account.saldo}</td>
                                <td className="py-2">{account.estado === 1 ? 'Activo' : 'Inactivo'}</td>
                                <td className="py-2 text-center">
                                    <button
                                        onClick={() => handleEdit(account)}
                                        className="bg-blue-500 text-white px-2 py-1 mr-1 rounded-lg">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button
                                        onClick={() => handleToggleAccountStatus(account.id_cuenta, account.estado)}
                                        className={`px-2 py-1 rounded-lg ${account.estado === 1 ? 'bg-red-500' : 'bg-green-500'} text-white` }
                                        
                                    >
                                        <FontAwesomeIcon icon={account.estado === 1 ? faThumbsDown : faThumbsUp} />
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

export default AccountForm;
