import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import FormularioBalance from '../Formularios/FormBalances';
import '../Styles/ListStyle.css';
import { AuthContext } from '../Contexts/AuthContext'; // Importar AuthContext

const ListaBalances = () => {
    const [balances, setBalances] = useState([]);
    const [balanceId, setBalanceId] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [clienteIdFiltro, setClienteIdFiltro] = useState(''); // Estado para el filtro de cliente_id
    const [fechaCorteFiltro, setFechaCorteFiltro] = useState(''); // Estado para el filtro de fecha de corte
    const [montoMinimoFiltro, setMontoMinimoFiltro] = useState(''); // Estado para el filtro de monto mínimo
    const [montoMaximoFiltro, setMontoMaximoFiltro] = useState(''); // Estado para el filtro de monto máximo
    const { role, username } = useContext(AuthContext); // Obtener role y username del contexto

    useEffect(() => {
        fetchBalances();
    }, []);

    const fetchBalances = () => {
        axios.get('http://localhost:3001/api/balances')
            .then(response => setBalances(response.data))
            .catch(error => console.error(error));
    };

    // Filtrar balances según el rol del usuario
    const balancesFiltrados = balances.filter(balance => {
        if (role === 'user') {
            return balance.cliente_id === username; // Solo el usuario normal puede ver su propio balance
        }
        return true; // Los administradores ven todos los balances
    });

    // Filtrar por cliente_id
    const balancesFiltradosPorClienteId = clienteIdFiltro
        ? balancesFiltrados.filter(balance => balance.cliente_id === clienteIdFiltro)
        : balancesFiltrados;

    // Filtrar por fecha de corte
    const balancesFiltradosPorFechaCorte = fechaCorteFiltro
        ? balancesFiltradosPorClienteId.filter(balance => 
            balance.fecha_corte.split('T')[0] === fechaCorteFiltro
        )
        : balancesFiltradosPorClienteId;

    // Filtrar por rango de montos
    const balancesFiltradosFinales = balancesFiltradosPorFechaCorte.filter(balance => {
        const monto = parseFloat(balance.monto);
        const montoMinimo = montoMinimoFiltro ? parseFloat(montoMinimoFiltro) : null;
        const montoMaximo = montoMaximoFiltro ? parseFloat(montoMaximoFiltro) : null;

        const cumpleMontoMinimo = montoMinimo === null || monto >= montoMinimo;
        const cumpleMontoMaximo = montoMaximo === null || monto <= montoMaximo;

        return cumpleMontoMinimo && cumpleMontoMaximo;
    });

    const agregarBalance = (nuevoBalance) => {
        setBalances(prevBalances => [...prevBalances, nuevoBalance]);
        setBalanceId(null);
        setMostrarFormulario(false); // Ocultar formulario después de agregar
    };

    const actualizarBalance = (actualizadoBalance) => {
        setBalances(prevBalances => 
            prevBalances.map(balance => 
                balance.id === actualizadoBalance.id ? actualizadoBalance : balance
            )
        );
        setBalanceId(null);
        setMostrarFormulario(false); // Ocultar formulario después de actualizar
    };

    const handleDelete = (balanceId) => {
        const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este balance?");
        
        if (isConfirmed) {
            axios.delete(`http://localhost:3001/api/balances/${balanceId}`)
                .then(response => {
                    alert('Balance eliminado');
                    fetchBalances();
                })
                .catch(error => {
                    console.error("Error al eliminar el balance:", error);
                    alert("Error al eliminar el balance");
                });
        } else {
            console.log("Eliminación cancelada");
        }
    };

    const toggleFormulario = () => {
        setMostrarFormulario(!mostrarFormulario);
        if (mostrarFormulario) {
            setBalanceId(null); // Reiniciar ID si se oculta el formulario
        }
    };

    // Función para limpiar los filtros
    const limpiarFiltros = () => {
        setClienteIdFiltro('');
        setFechaCorteFiltro('');
        setMontoMinimoFiltro('');
        setMontoMaximoFiltro('');
    };

    return (
        <div className="lista">
            <h2>Lista de Balances</h2>
            <div className="filtros-container"> {/* Contenedor para filtros */}
                <div className="filtro-fecha">
                    <label htmlFor="fechaCorteFiltro">Filtrar por Fecha de Corte:</label>
                    <input
                        type="date"
                        id="fechaCorteFiltro"
                        value={fechaCorteFiltro}
                        onChange={(e) => setFechaCorteFiltro(e.target.value)}
                        className="filtro-input" // Clase para el estilo
                    />
                </div>
                {role !== 'user' && ( // Mostrar dropdown solo para administradores
                    <div className="filtro-input">
                        <label htmlFor="clienteIdFiltro">Filtrar por Cliente ID:</label>
                        <select
                            id="clienteIdFiltro"
                            value={clienteIdFiltro}
                            onChange={(e) => setClienteIdFiltro(e.target.value)}
                            className="filtro-select" // Clase para el estilo
                        >
                            <option value="">Todos</option>
                            {balances.map(balance => (
                                <option key={balance.id} value={balance.cliente_id}>
                                    {balance.cliente_id}
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
                        className="filtro-input" // Clase para el estilo
                    />
                    <label htmlFor="montoMaximoFiltro">Monto Máximo:</label>
                    <input
                        type="number"
                        id="montoMaximoFiltro"
                        value={montoMaximoFiltro}
                        onChange={(e) => setMontoMaximoFiltro(e.target.value)}
                        className="filtro-input" // Clase para el estilo
                    />
                </div>
                <button className="button-limpiar-filtros" onClick={limpiarFiltros}>
                    Limpiar Filtros
                </button>
            </div>
            {balancesFiltradosFinales.length === 0 ? ( // Cambiar a balancesFiltradosFinales
                <p className="lista-vacia">No hay balances disponibles.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Cliente ID</th>
                            <th>Fecha de Corte</th>
                            <th>Monto</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {balancesFiltradosFinales.map((balance) => ( // Usar balancesFiltradosFinales aquí
                            <tr key={balance.id}>
                                <td>{balance.cliente_id}</td>
                                <td>{balance.fecha_corte.split('T')[0]}</td> 
                                <td>${parseFloat(balance.monto).toFixed(2)}</td>
                                <td>
                                    <div className="button-container">
                                        {role !== 'user' ? ( // Solo mostrar botones si no es un usuario normal
                                            <>
                                                <button onClick={() => {
                                                    setBalanceId(balance.id); // Establecer el ID del balance a editar
                                                    setMostrarFormulario(true); // Mostrar el formulario
                                                }}>Editar</button>
                                                <button onClick={() => handleDelete(balance.id)}>Eliminar</button>
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
            {role !== 'user' && ( // Mostrar el botón de agregar solo para usuarios no 'user'
                <button className="button-toggle-formulario" onClick={toggleFormulario}>
                    {mostrarFormulario ? "Ocultar Formulario" : "Agregar nuevo"}
                </button>
            )}
            {mostrarFormulario && (
                <FormularioBalance 
                    balanceId={balanceId}
                    fetchBalances={fetchBalances} 
                    agregarBalance={agregarBalance} 
                    actualizarBalance={actualizarBalance} 
                    setBalanceId={setBalanceId}
                    setMostrarFormulario={setMostrarFormulario}
                />
            )}
        </div>
    );
};

export default ListaBalances;
