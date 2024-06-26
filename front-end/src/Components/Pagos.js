import React, { useState, useEffect } from 'react';
import { connectToAPI } from '../api.js';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSquarePlus, faListCheck } from '@fortawesome/free-solid-svg-icons';
import Alert from '../layouts/Alert.js';

const PayServiceForm = () => {
    const [fechaPago, setFechaPago] = useState('');
    const [montoPago, setMontoPago] = useState('');
    const [idTipoServicio, setIdTipoServicio] = useState('');
    const [pays, setPays] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [editPayId, setEditPayId] = useState(null);
    const [alert, setAlert] = useState({ type: '', message: '', show: false });
    const [scanning, setScanning] = useState(false);
    const [rfidCardNumber, setRfidCardNumber] = useState('');
    const [ledStatus, setLedStatus] = useState('');

    const fetchAccounts = async () => {
        try {
            const response = await connectToAPI('/cuentasActivas');
            if (response.status) {
                setAccounts(response.data);
            } else {
                console.error('Error al obtener las cuentas:', response.error);
            }
        } catch (error) {
            console.error('Error al conectar con la API:', error);
        }
    };

    const fetchServiceTypes = async () => {
        try {
            const response = await connectToAPI('/typeServices');
            if (response.status) {
                setServiceTypes(response.data);
            } else {
                console.error('Error al obtener los tipos de servicio:', response.error);
            }
        } catch (error) {
            console.error('Error al conectar con la API:', error);
        }
    };

    const fetchPays = async () => {
        try {
            const response = await connectToAPI('/pagos');
            if (response.status) {
                setPays(response.data);
            } else {
                console.error('Error al obtener los pagos de servicio:', response.error);
            }
        } catch (error) {
            console.error('Error al conectar con la API:', error);
        }
    };

    useEffect(() => {
        fetchAccounts();
        fetchServiceTypes();
        fetchPays();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        let selectedAccount = null;
        try {
            const response = await connectToAPI(`/cards`);
            if (response.status) {
                const accounts = Array.isArray(response.data) ? response.data : [];
                selectedAccount = accounts.find(account => account.numero_tarjeta === rfidCardNumber);
            } else {
                console.error('Error al obtener la cuenta:', response.error);
            }
        } catch (error) {
            console.error('Error al conectar con la API:', error);
        }
    
        if (!selectedAccount) {
            setAlert({ type: 'error', message: 'No se encontró una cuenta asociada con este RFID', show: true });
            return;
        }
    
        const endpoint = editPayId ? `/updatePay/${editPayId}` : '/newPay';
        const method = editPayId ? 'PUT' : 'POST';
    
        try {
            const data = {
                fecha_pago: fechaPago,
                monto_pago: parseFloat(montoPago),
                id_cuenta: selectedAccount.id_cuenta,
                id_tipo_servicio: parseInt(idTipoServicio, 10)
            };
            const response = await connectToAPI(endpoint, data, method);
            if (response.status) {
                setAlert({ type: 'success', message: 'Operación exitosa', show: true });
                fetchPays();
                handleSuccessfulPayment(); // Llamar a la función para encender el LED
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
    
    const handleSuccessfulPayment = async () => {
        try {
            // Envía la solicitud HTTP al ESP32 para encender el LED
            const response = await fetch('http://192.168.0.22/led?action=on');
            if (response.ok) {
                console.log('LED encendido correctamente');
            } else {
                console.error('Error al encender el LED:', response.statusText);
            }
        } catch (error) {
            console.error('Error al conectar con el ESP32:', error);
        }
    };
    const handleEdit = (pay) => {
        setFechaPago(pay.fecha_pago || '');
        setMontoPago(pay.monto_pago ? pay.monto_pago.toString() : '');
        setIdTipoServicio(pay.id_tipo_servicio ? pay.id_tipo_servicio.toString() : '');
        setEditPayId(pay.id_pago_servicio);
    };

    const handleCancel = () => {
        setFechaPago('');
        setMontoPago('');
        setIdTipoServicio('');
        setEditPayId(null);
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro que deseas eliminar este pago?',
                text: 'Esta acción no se puede deshacer',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar!'
            });
            if (result.isConfirmed) {
                const response = await connectToAPI(`/deletePay/${id}`, {}, 'DELETE');

                if (response.status) {
                    setAlert({ type: 'success', message: 'Pago eliminado correctamente', show: true });
                    fetchPays();
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

    const handleScan = () => {
        Swal.fire({
            title: 'Escaneando',
            text: 'Por favor, acerque la tarjeta al lector...',
            icon: 'info',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                setScanning(true);
                const startTime = Date.now();
                let socket = new WebSocket("ws://192.168.1.110:81/");

                socket.onopen = () => {
                    console.log("WebSocket connected");
                };

                socket.onmessage = (event) => {
                    console.log("UID recibido: " + event.data);
                    setRfidCardNumber(event.data);
                    setScanning(false);
                    Swal.close();
                    const endTime = Date.now();
                    console.log(`Tiempo total: ${endTime - startTime} ms`);
                    socket.close();

                    // Reiniciar el ESP32
                    fetch('/reset')
                        .then(() => console.log('ESP32 reiniciado'))
                        .catch(error => console.error('Error al reiniciar el ESP32:', error));
                };

                socket.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    setScanning(false);
                    Swal.fire('Error', 'Error al conectar con el lector de tarjetas.', 'error');
                    socket.close();
                };

                socket.onclose = () => {
                    console.log("WebSocket closed");
                    setScanning(false);
                };
            },
            willClose: () => {
                setScanning(false);
            }
        });
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-200 p-6">
            {alert.show && <Alert type={alert.type} message={alert.message} />}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-4/5 mb-6">
            {ledStatus && <p>{ledStatus}</p>}
                <h2 className="text-2xl font-bold mb-6">
                    <FontAwesomeIcon icon={faSquarePlus} /> {editPayId ? 'Editar Pago de Servicio' : 'Nuevo Pago de Servicio'}
                </h2>
                <div className="mb-4">
                    <label htmlFor="fechaPago" className="block text-gray-700 font-bold mb-2">
                        Fecha de Pago
                    </label>
                    <input
                        type="date"
                        id="fechaPago"
                        value={fechaPago}
                        onChange={(e) => setFechaPago(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="montoPago" className="block text-gray-700 font-bold mb-2">
                        Monto del Pago
                    </label>
                    <input
                        type="number"
                        id="montoPago"
                        value={montoPago}
                        onChange={(e) => setMontoPago(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="rfidCardNumber" className="block text-gray-700 font-bold mb-2">
                        Número de Tarjeta RFID
                    </label>
                    <div className="flex">
                        <input
                            type="text"
                            id="rfidCardNumber"
                            value={rfidCardNumber}
                            onChange={(e) => setRfidCardNumber(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500"
                            required
                            readOnly
                        />
                        <button
                            type="button"
                            onClick={handleScan}
                            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
                            disabled={scanning}
                        >
                            Escanear
                        </button>
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="idTipoServicio" className="block text-gray-700 font-bold mb-2">
                        Tipo de Servicio
                    </label>
                    <select
                        id="idTipoServicio"
                        value={idTipoServicio}
                        onChange={(e) => setIdTipoServicio(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    >
                        <option value="">Seleccione un tipo de servicio</option>
                        {serviceTypes.map((type) => (
                            <option key={type.id_tipo_servicio} value={type.id_tipo_servicio}>
                                {type.nombre_servicio}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        {editPayId ? 'Actualizar' : 'Registrar'}
                    </button>
                    {editPayId && (
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
                    <FontAwesomeIcon icon={faListCheck} /> Pagos de Servicio Registrados
                </h2>
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2">ID</th>
                            <th className="py-2">Fecha de Pago</th>
                            <th className="py-2">Monto</th>
                            <th className="py-2">Cuenta</th>
                            <th className="py-2">Tipo de Servicio</th>
                            <th className="py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pays.map((pay, index) => (
                            <tr key={pay.id_pago_servicio} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                                <td className="py-2">{pay.id_pago_servicio}</td>
                                <td className="py-2">{new Date(pay.fecha_pago).toLocaleString()}</td>
                                <td className="py-2">{pay.monto_pago}</td>
                                <td className="py-2">{pay.cuenta.numero_cuenta}</td>
                                <td className="py-2">{pay.tipoServicio.nombre_servicio}</td>
                                <td className="py-2 text-center">
                                    <button
                                        onClick={() => handleEdit(pay)}
                                        className="bg-blue-500 text-white px-2 py-1 mr-1 rounded-lg"
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(pay.id_pago_servicio)}
                                        className="bg-red-500 text-white px-2 py-1 rounded-lg"
                                    >
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

export default PayServiceForm;
