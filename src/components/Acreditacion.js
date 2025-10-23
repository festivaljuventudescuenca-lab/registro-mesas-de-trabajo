import React from 'react';
import portada from '../img/portada.png';
import { useNavigate } from 'react-router-dom';

const Acreditacion = () => {

    const goHome = () => {
        // Borra el hash para volver al inicio
        window.location.hash = '';
    };
    return (
        <div
            className="min-h-screen w-full bg-center bg-cover flex items-center justify-center p-6"
            style={{ backgroundImage: `url(${portada})` }}
        >
            <div
                className="max-w-3xl rounded-xl p-8 text-center shadow"
                style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                    border: '1px solid rgba(34,197,94,0.22)',
                }}
            >
                <h1
                    className="text-3xl font-extrabold mb-4"
                    style={{
                        color: 'white',
                        WebkitTextStroke: '1px #16a34a', // contorno verde
                        // textShadow: '0 0 5px rgba(22,163,74,0.6)', // brillo verde suave
                    }}
                >
                    Acreditación válida
                </h1>

                <h2
                    className="text-2xl leading-relaxed"
                    style={{
                        color: 'white',
                        WebkitTextStroke: '1px #ffffffff',
                        textShadow: '0 0 4px rgba(22,163,74,0.5)',
                    }}
                >
                    Su acreditación ha sido válida. Nos vemos en el Festival Nacional de Juventudes - Congreso Académico el 31 de octubre de 2025 a las 8 am en el Teatro Sucre (Sucre y Luis Cordero junto a la Corte Provincial de Justicia).
                </h2>

                <div className="mt-6">
                    <button
                        onClick={goHome}
                        className="inline-block bg-green-700 hover:bg-green-600 text-white px-5 py-3 rounded-lg font-semibold"
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );

};

export default Acreditacion;
