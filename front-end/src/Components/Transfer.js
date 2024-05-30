import React, { useState, useEffect } from 'react';
import { connectToAPI } from '../api.js';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSquarePlus, faListCheck } from '@fortawesome/free-solid-svg-icons';
import Alert from '../layouts/Alert.js'; // Asegúrate de que esta ruta sea correcta

const TransferForm = () => {
    const [fechaTransferencia, setFechaTransferencia] = useState('');
    const [montoTransferencia, setMontoTransferencia] = useState('');
    const [cuentaOrigenId, setCuentaOrigenId] = useState('');
    const [cuentaDestinoId, setCuentaDestinoId] = useState('');
    const [idUsuarioAutorizador, setIdUsuarioAutorizador] = useState('');
    const [transfers, setTransfers] = useState([]);
    const [editTransferId, setEditTransferId] = useState(null);
    const [alert, setAlert] = useState({ type: '', message: '', show: false });

    const fetchTransfers = async () => {
        try {
            const response = await connectToAPI('/transfers');
            if (response.status) {
                setTransfers(response.data);
            } else {
                console.error('Error al obtener las transferencias:', response.error);
            }
        } catch (error) {
            console.error('Error al conectar con la API:', error);
        }
    };

    useEffect(() => {
        fetchTransfers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = editTransferId ? `/updateTransfer/${editTransferId}` : '/newTransfer';
        const method = editTransferId ? 'PUT' : 'POST';
        try {
            const response = await connectToAPI(endpoint, {
                id_transferencia: editTransferId,
                fecha_transferencia: fechaTransferencia,
                monto_transferencia: parseInt(montoTransferencia),
                cuenta_origen: parseInt(cuentaOrigenId),
                cuenta_destino: parseInt(cuentaDestinoId),
                id_usuario_autorizador: parseInt(idUsuarioAutorizador)
            }, method);
            if (response.status) {
                setAlert({ type: 'success', message: 'Operación exitosa', show: true });
                fetchTransfers();
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

    const handleEdit = (transfer) => {
        setFechaTransferencia(transfer.fecha_transferencia || '');
        setMontoTransferencia((transfer.monto_transferencia || '').toString());
        setCuentaOrigenId((transfer.cuenta_origen && transfer.cuenta_origen.id_cuenta) ? transfer.cuenta_origen.id_cuenta.toString() : '');
        setCuentaDestinoId((transfer.cuenta_destino && transfer.cuenta_destino.id_cuenta) ? transfer.cuenta_destino.id_cuenta.toString() : '');
        setIdUsuarioAutorizador((transfer.id_usuario_autorizador || '').toString());
        setEditTransferId(transfer.id_transferencia);
    };


    const handleCancel = () => {
        setFechaTransferencia('');
        setMontoTransferencia('');
        setCuentaOrigenId('');
        setCuentaDestinoId('');
        setIdUsuarioAutorizador('');
        setEditTransferId(null);
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
                const response = await connectToAPI(`/deleteTransfer/${id}`, {}, 'DELETE');
                if (response.status) {
                    setAlert({ type: 'success', message: 'Transferencia eliminada correctamente', show: true });
                    fetchTransfers();
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
                    <FontAwesomeIcon icon={faSquarePlus} /> {editTransferId ? 'Editar Transferencia' : 'Nueva Transferencia'}
                </h2>
                <div className="mb-4">
                    <label htmlFor="fechaTransferencia" className="block text-gray-700 font-bold mb-2">
                        Fecha de Transferencia
                    </label>
                    <input
                        type="date"
                        id="fechaTransferencia"
                        value={fechaTransferencia}
                        onChange={(e) => setFechaTransferencia(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="montoTransferencia" className="block text-gray-700 font-bold mb-2">
                        Monto de Transferencia
                    </label>
                    <input
                        type="number"
                        id="montoTransferencia"
                        value={montoTransferencia}
                        onChange={(e) => setMontoTransferencia(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="cuentaOrigenId" className="block text-gray-700 font-bold mb-2">
                        ID de Cuenta de Origen
                    </label>
                    <input
                        type="number"
                        id="cuentaOrigenId"
                        value={cuentaOrigenId}
                        onChange={(e) => setCuentaOrigenId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="cuentaDestinoId" className="block text-gray-700 font-bold mb-2">
                        ID de Cuenta de Destino
                    </label>
                    <input
                        type="number"
                        id="cuentaDestinoId"
                        value={cuentaDestinoId}
                        onChange={(e) => setCuentaDestinoId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">

                    <label htmlFor="idUsuarioAutorizador" className="block text-gray-700 font-bold mb-2">
                        ID de Usuario Autorizador
                    </label>
                    <input
                        type="number"
                        id="idUsuarioAutorizador"
                        value={idUsuarioAutorizador}
                        onChange={(e) => setIdUsuarioAutorizador(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
                        {editTransferId ? 'Actualizar' : 'Enviar'}
                    </button>
                    <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:bg-gray-700 ml-2">
                        Cancelar
                    </button>
                </div>
            </form>
            <div className="bg-white p-6 rounded-lg shadow-lg w-4/5">
                <h2 className="text-2xl font-bold mb-4"><FontAwesomeIcon icon={faListCheck} /> Transferencias Registradas</h2>
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Fecha de Transferencia</th>
                            <th className="px-4 py-2">Monto de Transferencia</th>
                            <th className="px-4 py-2">ID de Cuenta de Origen</th>
                            <th className="px-4 py-2">ID de Cuenta de Destino</th>
                            <th className="px-4 py-2">ID de Usuario Autorizador</th>
                            <th className="px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transfers.map((transfer, index) => (
                            <tr key={transfer.id_transferencia} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                <td className="border px-4 py-2 text-center">{transfer.id_transferencia}</td>
                                <td className="border px-4 py-2">{transfer.fecha_transferencia}</td>
                                <td className="border px-4 py-2">{transfer.monto_transferencia}</td>
                                <td className="border px-4 py-2">{transfer.cuenta_origen.nombre_cliente}</td>
                                <td className="border px-4 py-2">{transfer.cuenta_destino.nombre_cliente}</td>
                                <td className="border px-4 py-2">{transfer.usuario_autorizador.nombre_usuario}</td>
                                <td className="border px-4 py-2 text-center">
                                    <button onClick={() => handleEdit(transfer)} className="bg-blue-500 text-white px-2 py-1 mr-1 rounded-lg">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button onClick={() => handleDelete(transfer.id_transferencia)} className="bg-red-500 text-white px-2 py-1 rounded-lg">
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

export default TransferForm;
