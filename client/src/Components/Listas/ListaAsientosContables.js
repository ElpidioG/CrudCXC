import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import FormularioAsientoContable from '../Formularios/FormAsientosContables';
import '../Styles/ListStyle.css';
import { AuthContext } from '../Contexts/AuthContext';

const ListaAsientosContables = () => {
    const [asientosContables, setAsientosContables] = useState([]);
    const [asientoContableId, setAsientoContableId] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [clienteIdFiltro, setClienteIdFiltro] = useState(''); // Estado para el filtro de cliente_id
    const [fechaFiltro, setFechaFiltro] = useState(''); // Estado para el filtro de fecha
    const [montoMinimoFiltro, setMontoMinimoFiltro] = useState(''); // Estado para el filtro de monto mínimo
    const [montoMaximoFiltro, setMontoMaximoFiltro] = useState(''); // Estado para el filtro de monto máximo
    const { role, username } = useContext(AuthContext);

    useEffect(() => {
        fetchAsientosContables();
    }, []);

    const fetchAsientosContables = () => {
        axios.get('http://localhost:3001/api/asientos_contables')
            .then(response => setAsientosContables(response.data))
            .catch(error => console.error(error));
    };

    const actualizarAsientoContable = (actualizadoAsientoContable) => {
        setAsientosContables(prevAsientosContables => 
            prevAsientosContables.map(asiento => 
                asiento.id === actualizadoAsientoContable.id ? actualizadoAsientoContable : asiento
            )
        );
        setAsientoContableId(null);
        setMostrarFormulario(false); // Ocultar formulario después de actualizar
    };

    const handleDelete = (id) => {
        const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este asiento contable?");
        
        if (isConfirmed) {
            axios.delete(`http://localhost:3001/api/asientos_contables/${id}`)
                .then(() => {
                    alert('Asiento contable eliminado');
                    fetchAsientosContables();
                })
                .catch(error => {
                    console.error("Error al eliminar el asiento contable:", error);
                    alert("Error al eliminar el asiento contable");
                });
        } else {
            console.log("Eliminación cancelada");
        }
    };

    const asientosFiltrados = role === 'user'
        ? asientosContables.filter(asiento => asiento.cliente_id === username)
        : asientosContables;

    // Filtrar por cliente_id
    const asientosFiltradosPorClienteId = clienteIdFiltro
        ? asientosFiltrados.filter(asiento => asiento.cliente_id === clienteIdFiltro)
        : asientosFiltrados;

    // Filtrar por fecha
    const asientosFiltradosPorFecha = fechaFiltro
        ? asientosFiltradosPorClienteId.filter(asiento => 
            asiento.fecha.split('T')[0] === fechaFiltro
        )
        : asientosFiltradosPorClienteId;

    // Filtrar por rango de montos
    const asientosFiltradosFinales = asientosFiltradosPorFecha.filter(asiento => {
        const monto = parseFloat(asiento.monto);
        const montoMinimo = montoMinimoFiltro ? parseFloat(montoMinimoFiltro) : null;
        const montoMaximo = montoMaximoFiltro ? parseFloat(montoMaximoFiltro) : null;

        const cumpleMontoMinimo = montoMinimo === null || monto >= montoMinimo;
        const cumpleMontoMaximo = montoMaximo === null || monto <= montoMaximo;

        return cumpleMontoMinimo && cumpleMontoMaximo;
    });

    const toggleFormulario = () => {
        setMostrarFormulario(!mostrarFormulario);
        if (mostrarFormulario) {
            setAsientoContableId(null); // Reiniciar ID si se oculta el formulario
        }
    };

    const handleEdit = (asientoContable) => {
        setAsientoContableId(asientoContable.id); // Establecer el ID del asiento contable a editar
        setMostrarFormulario(true); // Mostrar el formulario
    };

    // Función para limpiar los filtros
    const limpiarFiltros = () => {
        setClienteIdFiltro('');
        setFechaFiltro('');
        setMontoMinimoFiltro('');
        setMontoMaximoFiltro('');
    };

    return (
        <div className="lista">
            <h2>Lista de Asientos Contables</h2>
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
                {role !== 'user' && ( // Mostrar dropdown solo para administradores
                    <div className="filtro-cliente-id">
                        <label htmlFor="clienteIdFiltro">Filtrar por Cliente ID:</label>
                        <select
                            id="clienteIdFiltro"
                            value={clienteIdFiltro}
                            onChange={(e) => setClienteIdFiltro(e.target.value)}
                            className="filtro-select"
                        >
                            <option value="">Todos</option>
                            {asientosFiltrados.map(asiento => (
                                <option key={asiento.id} value={asiento.cliente_id}>
                                    {asiento.cliente_id}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
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
            {asientosFiltradosFinales.length === 0 ? (
                <p className="lista-vacia">No hay asientos contables disponibles.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Cliente ID</th>
                            <th>Descripción</th>
                            <th>Fecha</th>
                            <th>Monto</th>
                            <th>Tipo de Movimiento</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {asientosFiltradosFinales.map((asientoContable) => (
                            <tr key={asientoContable.id}>
                                <td>{asientoContable.cliente_id}</td>
                                <td>{asientoContable.descripcion}</td>
                                <td>{asientoContable.fecha.split('T')[0]}</td> 
                                <td>${parseFloat(asientoContable.monto).toFixed(2)}</td>
                                <td>{asientoContable.tipo_movimiento}</td>
                                <td>
                                    <div className="button-container">
                                        {role !== 'user' ? (
                                            <>
                                                <button onClick={() => handleEdit(asientoContable)}>Editar</button>
                                                <button onClick={() => handleDelete(asientoContable.id)}>Eliminar</button>
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
            {role !== 'user' && (
                <>
                    <button className="button-toggle-formulario" onClick={toggleFormulario}>
                        {mostrarFormulario ? "Ocultar Formulario" : "Agregar nuevo"}
                    </button>
                    {mostrarFormulario && (
                        <FormularioAsientoContable 
                            asientoContableId={asientoContableId}
                            fetchAsientosContables={fetchAsientosContables} 
                            actualizarAsientoContable={actualizarAsientoContable} 
                            setAsientoContableId={setAsientoContableId}
                            setMostrarFormulario={setMostrarFormulario}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default ListaAsientosContables;
