import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormularioTransaccion from '../Formularios/FormTransacciones';
import '../Styles/ListStyle.css';

const ListaTransacciones = () => {
    const [transacciones, setTransacciones] = useState([]);
    const [transaccionId, setTransaccionId] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    useEffect(() => {
        fetchTransacciones();
    }, []);

    const fetchTransacciones = () => {
        axios.get('http://localhost:3001/api/transacciones')
            .then(response => setTransacciones(response.data))
            .catch(error => console.error(error));
    };

    const agregarTransaccion = (nuevoTransaccion) => {
        setTransacciones(prevTransacciones => [...prevTransacciones, nuevoTransaccion]);
        setTransaccionId(null);
    };

    const actualizarTransaccion = (actualizadoTransaccion) => {
        setTransacciones(prevTransacciones => 
            prevTransacciones.map(transaccion => 
                transaccion.id === actualizadoTransaccion.id ? actualizadoTransaccion : transaccion
            )
        );
        setTransaccionId(null);
    };

    const handleDelete = (transaccionId) => {
        const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar esta transacción?");
        
        if (isConfirmed) {
            axios.delete(`http://localhost:3001/api/transacciones/${transaccionId}`)
                .then(response => {
                    alert('Transacción eliminada');
                    fetchTransacciones();
                })
                .catch(error => {
                    console.error("Error al eliminar la transacción:", error);
                    alert("Error al eliminar la transacción");
                });
        } else {
            console.log("Eliminación cancelada");
        }
    };

    const toggleFormulario = () => {
        setMostrarFormulario(!mostrarFormulario);
    };

    return (
        <div className="lista">
            <h2>Lista de Transacciones</h2>
            {transacciones.length === 0 ? (
                <p className="lista-vacia">No hay transacciones disponibles.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Tipo de Movimiento</th>
                            <th>Tipo de Documento</th>
                            <th>Número de Documento</th>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Monto</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transacciones.map((transaccion) => (
                            <tr key={transaccion.id}>
                                <td>{transaccion.tipo_movimiento}</td>
                                <td>{transaccion.tipo_documento_id}</td>
                                <td>{transaccion.numero_documento}</td>
                                <td>{transaccion.fecha.split('T')[0]}</td>
                                <td>{transaccion.cliente_id}</td>
                                <td>${parseFloat(transaccion.monto).toFixed(2)}</td>
                                <td>
                                    <div className="button-container">
                                        <button onClick={() => setTransaccionId(transaccion.id)}>Editar</button>
                                        <button onClick={() => handleDelete(transaccion.id)}>Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <button className="button-toggle-formulario" onClick={toggleFormulario}>
                {mostrarFormulario ? "Ocultar Formulario" : "Agregar nuevo"}
            </button>
            {mostrarFormulario && (
                <FormularioTransaccion 
                    transaccionId={transaccionId}
                    fetchTransacciones={fetchTransacciones} 
                    agregarTransaccion={agregarTransaccion} 
                    actualizarTransaccion={actualizarTransaccion} 
                    setTransaccionId={setTransaccionId}
                />
            )}
        </div>
    );
};

export default ListaTransacciones;
