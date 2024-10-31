import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import FormularioTransaccion from '../Formularios/FormTransacciones';
import '../Styles/ListStyle.css';
import { AuthContext } from '../Contexts/AuthContext';

const ListaTransacciones = () => {
    const [transacciones, setTransacciones] = useState([]);
    const [transaccionId, setTransaccionId] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [fechaFiltro, setFechaFiltro] = useState(''); // Estado para el filtro de fecha
    const [montoMinimoFiltro, setMontoMinimoFiltro] = useState(''); // Estado para el filtro de monto mínimo
    const [montoMaximoFiltro, setMontoMaximoFiltro] = useState(''); // Estado para el filtro de monto máximo
    const { role, username } = useContext(AuthContext);

    useEffect(() => {
        fetchTransacciones();
    }, []);

    const fetchTransacciones = () => {
        axios.get('http://localhost:3001/api/transacciones')
            .then(response => setTransacciones(response.data))
            .catch(error => console.error(error));
    };

    const transaccionesFiltradas = role === 'user'
        ? transacciones.filter(transaccion => transaccion.cliente_id === username)
        : transacciones;

    // Filtrar por fecha
    const transaccionesFiltradasPorFecha = fechaFiltro
        ? transaccionesFiltradas.filter(transaccion => 
            transaccion.fecha.split('T')[0] === fechaFiltro
        )
        : transaccionesFiltradas;

    // Filtrar por rango de montos
    const transaccionesFiltradasFinales = transaccionesFiltradasPorFecha.filter(transaccion => {
        const monto = parseFloat(transaccion.monto);
        const montoMinimo = montoMinimoFiltro ? parseFloat(montoMinimoFiltro) : null;
        const montoMaximo = montoMaximoFiltro ? parseFloat(montoMaximoFiltro) : null;

        const cumpleMontoMinimo = montoMinimo === null || monto >= montoMinimo;
        const cumpleMontoMaximo = montoMaximo === null || monto <= montoMaximo;

        return cumpleMontoMinimo && cumpleMontoMaximo;
    });

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
        setMostrarFormulario(false); // Ocultar formulario después de actualizar
        fetchTransacciones(); // Actualizar la lista después de actualizar la transacción
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
        if (mostrarFormulario) setTransaccionId(null); // Reiniciar ID si se oculta el formulario
    };

    // Función para limpiar los filtros
    const limpiarFiltros = () => {
        setFechaFiltro('');
        setMontoMinimoFiltro('');
        setMontoMaximoFiltro('');
    };

    return (
        <div className="lista">
            <h2>Lista de Transacciones</h2>
            <div className="filtros-container"> {/* Contenedor para filtros */}
                <div className="filtro-fecha">
                    <label htmlFor="fechaFiltro">Filtrar por Fecha:</label>
                    <input
                        type="date"
                        id="fechaFiltro"
                        value={fechaFiltro}
                        onChange={(e) => setFechaFiltro(e.target.value)}
                        className="filtro-input"
                    />
                </div>
                <div className="filtro-montos">
                    <label htmlFor="montoMinimoFiltro">Monto Mínimo:</label>
                    <input
                        type="number"
                        id="montoMinimoFiltro"
                        value={montoMinimoFiltro}
                        onChange={(e) => setMontoMinimoFiltro(e.target.value)}
                        className="filtro-input"
                    />
                    <label htmlFor="montoMaximoFiltro">Monto Máximo:</label>
                    <input
                        type="number"
                        id="montoMaximoFiltro"
                        value={montoMaximoFiltro}
                        onChange={(e) => setMontoMaximoFiltro(e.target.value)}
                        className="filtro-input"
                    />
                </div>
                <button className="button-limpiar-filtros" onClick={limpiarFiltros}>
                    Limpiar Filtros
                </button>
            </div>
            {transaccionesFiltradasFinales.length === 0 ? (
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
                        {transaccionesFiltradasFinales.map((transaccion) => (
                            <tr key={transaccion.id}>
                                <td>{transaccion.tipo_movimiento}</td>
                                <td>{transaccion.tipo_documento_id}</td>
                                <td>{transaccion.numero_documento}</td>
                                <td>{transaccion.fecha.split('T')[0]}</td>
                                <td>{transaccion.cliente_id}</td>
                                <td>${parseFloat(transaccion.monto).toFixed(2)}</td>
                                <td>
                                    <div className="button-container">
                                        {role !== 'user' ? (
                                            <>
                                                <button onClick={() => {
                                                    setTransaccionId(transaccion.id); // Establecer el ID de transacción
                                                    setMostrarFormulario(true); // Mostrar el formulario
                                                }}>
                                                    Editar
                                                </button>
                                                <button onClick={() => handleDelete(transaccion.id)}>Eliminar</button>
                                            </>
                                        ) : (
                                            <span>No tienes permisos para editar o eliminar.</span>
                                        )}
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
