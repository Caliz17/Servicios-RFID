import React, { useState, useEffect } from 'react';
import { connectToAPI } from '../api.js';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faThumbsDown, faThumbsUp, faSquarePlus, faListCheck } from '@fortawesome/free-solid-svg-icons';
import Alert from '../layouts/Alert.js';

const RfidCardForm = () => {
    const [numeroTarjeta, setNumeroTarjeta] = useState('');
    const [idCuenta, setIdCuenta] = useState('');
    const [fechaAsignacion, setFechaAsignacion] = useState('');
    const [estado, setEstado] = useState(1);
    const [cards, setCards] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [editCardId, setEditCardId] = useState(null);
    const [alert, setAlert] = useState({ type: '', message: '', show: false });
    const [scanning, setScanning] = useState(false);

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

    const fetchCards = async () => {
        try {
            const response = await connectToAPI('/cards');
            if (response.status) {
                setCards(response.data);
            } else {
                console.error('Error al obtener las tarjetas RFID:', response.error);
            }
        } catch (error) {
            console.error('Error al conectar con la API:', error);
        }
    };

    useEffect(() => {
        fetchAccounts();
        fetchCards();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = editCardId ? `/updateCard/${editCardId}` : '/newCard';
        const method = editCardId ? 'PUT' : 'POST';

        try {
            const data = {
                numero_tarjeta: numeroTarjeta,
                id_cuenta: parseInt(idCuenta, 10),
                fecha_asignacion: fechaAsignacion,
                estado
            };
            const response = await connectToAPI(endpoint, data, method);
            if (response.status) {
                setAlert({ type: 'success', message: 'Operación exitosa', show: true });
                fetchCards();
                handleCancel();
            } else {
                setAlert({ type: 'error', message: response.message, show: true });
            }
        } catch (error) {
            console.error('Error al conectar con la API:', error);
            setAlert({ type: 'error', message: 'Error al conectar con la API', show: true });
        }
    };

    const handleEdit = (card) => {
        setNumeroTarjeta(card.numero_tarjeta || '');
        setIdCuenta(card.id_cuenta ? card.id_cuenta.toString() : '');
        setFechaAsignacion(card.fecha_asignacion || '');
        setEstado(card.estado);
        setEditCardId(card.id_tarjeta);
    };

    const handleCancel = () => {
        setNumeroTarjeta('');
        setIdCuenta('');
        setFechaAsignacion('');
        setEstado(1);
        setEditCardId(null);
    };

    const handleDelete = async (id, rfidState) => {
        try {
            const action = rfidState === 1 ? 'desactivar' : 'activar';
            const endpoint = rfidState === 1 ? `/downCard/${id}` : `/upCard/${id}`;
            const result = await Swal.fire({
                title: `¿Estás seguro que deseas ${action} esta tarjeta?`,
                text: 'Esta acción se puede deshacer',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: `Sí, ${action}la!`,
            });

            if (result.isConfirmed) {
                const response = await connectToAPI(endpoint, {}, 'PUT');
                if (response.status) {
                    setAlert({ type: 'success', message: `Tarjeta ${action}da correctamente`, show: true });
                    fetchCards();
                } else {
                    console.error(`Error al ${action}la`, response.error);
                    setAlert({ type: 'error', message: `Error al ${action}la`, show: true });
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
                    setNumeroTarjeta(event.data);
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
                <h2 className="text-2xl font-bold mb-6">
                    <FontAwesomeIcon icon={faSquarePlus} /> {editCardId ? 'Editar Tarjeta RFID' : 'Nueva Tarjeta RFID'}
                </h2>
                <div className="mb-4">
                    <label htmlFor="numeroTarjeta" className="block text-gray-700 font-bold mb-2">
                        Número de Tarjeta
                    </label>
                    <div className="flex">
                        <input
                            type="text"
                            id="numeroTarjeta"
                            value={numeroTarjeta}
                            onChange={(e) => setNumeroTarjeta(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 bg-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                            readOnly={true}
                        />
                        <button
                            type="button"
                            onClick={handleScan}
                            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Escanear
                        </button>
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="idCuenta" className="block text-gray-700 font-bold mb-2">
                        Cuenta
                    </label>
                    <select
                        id="idCuenta"
                        value={idCuenta}
                        onChange={(e) => setIdCuenta(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    >
                        <option value="">Seleccione una cuenta</option>
                        {accounts.map((account) => (
                            <option key={account.id_cuenta} value={account.id_cuenta}>
                                {account.nombre_cliente} - {account.numero_cuenta}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="fechaAsignacion" className="block text-gray-700 font-bold mb-2">
                        Fecha de Asignación
                    </label>
                    <input
                        type="date"
                        id="fechaAsignacion"
                        value={fechaAsignacion}
                        onChange={(e) => setFechaAsignacion(e.target.value)}
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
                        onChange={(e) => setEstado(parseInt(e.target.value, 10))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    >
                        <option value={1}>Activa</option>
                        <option value={0}>Inactiva</option>
                    </select>
                </div>
                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        {editCardId ? 'Actualizar' : 'Registrar'}
                    </button>
                    {editCardId && (
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
                    <FontAwesomeIcon icon={faListCheck} /> Tarjetas RFID Registradas
                </h2>
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2">ID</th>
                            <th className="py-2">Número de Tarjeta</th>
                            <th className="py-2">Cuenta</th>
                            <th className="py-2">Fecha de Asignación</th>
                            <th className="py-2">Estado</th>
                            <th className="py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cards.map((card, index) => (
                            <tr key={card.id_tarjeta} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                                <td className='py-2'>{card.id_tarjeta}</td>
                                <td className="py-2">{card.numero_tarjeta}</td>
                                <td className="py-2">{card.cuenta.numero_cuenta}</td>
                                <td className="py-2">{new Date(card.fecha_asignacion).toLocaleDateString('es-ES').replace(/\//g, '-')}</td>
                                <td className="py-2">{card.estado === 1 ? 'Activa' : 'Inactiva'}</td>
                                <td className="py-2 text-center">
                                    <button
                                        onClick={() => handleEdit(card)}
                                        className="bg-blue-500 text-white px-2 py-1 mr-1 rounded-lg"
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button onClick={() => handleDelete(card.id_tarjeta, card.estado)} className={`px-2 py-1 rounded-lg ${card.estado === 1 ? 'bg-red-500' : 'bg-green-500'} text-white`}>
                                        <FontAwesomeIcon icon={card.estado === 1 ? faThumbsDown : faThumbsUp} />
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

export default RfidCardForm;
