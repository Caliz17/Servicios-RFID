import React, { useState, useEffect } from 'react';
import { connectToAPI } from '../api.js';

const AuditoriaTable = () => {
    const [auditorias, setAuditorias] = useState([]);

    const fetchAuditorias = async () => {
        try {
            const response = await connectToAPI('/auditorias');
            if (response && response.data) {
                setAuditorias(response.data);
            } else {
                console.error('Error fetching auditorias:', response ? response.error : 'Response is null or undefined');
            }
        } catch (error) {
            console.error('Error connecting to API:', error);
        }
    }
    

    useEffect(() => {
        fetchAuditorias();
    }
    , []);
    

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">Auditorías</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">ID</th>
                            <th className="py-3 px-6 text-left">Fecha y Hora</th>
                            <th className="py-3 px-6 text-left">Acción</th>
                            <th className="py-3 px-6 text-left">Tabla Afectada</th>
                            <th className="py-3 px-6 text-left">ID Registro Afectado</th>
                            <th className="py-3 px-6 text-left">ID Usuario</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {auditorias.map((auditoria) => (
                            <tr key={auditoria.id_auditoria} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left">{auditoria.id_auditoria}</td>
                                <td className="py-3 px-6 text-left">{auditoria.fecha_hora}</td>
                                <td className="py-3 px-6 text-left">{auditoria.accion}</td>
                                <td className="py-3 px-6 text-left">{auditoria.tabla_afectada}</td>
                                <td className="py-3 px-6 text-left">{auditoria.id_registro_afectado}</td>
                                <td className="py-3 px-6 text-left">{auditoria.id_usuario}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export default AuditoriaTable;
