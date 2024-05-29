import React from "react";

const TypeAccount = () => {

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-200 p-6">
            <form className="bg-white p-6 rounded-lg shadow-lg w-4/5 mb-6">
                <h2 className="text-2xl font-bold mb-6 ">Tipos de Cuenta</h2>
                <div className="mb-4">
                    <label>
                        Tipo de Cuenta
                    </label>
                    <input type="text" id="nombre_tipo_cuenta" value={''} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required >
                    </input>
                </div>
            </form>
        </div>
    );
}

export default TypeAccount;