import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormularioCliente from '../Formularios/FormClientes';
import '../Styles/ListStyle.css';

const ListaClientes = () => {
    const [clientes, setClientes] = useState([]);
    const [clienteCedula, setClienteCedula] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [cedulaFiltro, setCedulaFiltro] = useState(''); // Estado para filtro de cédula
    const [nombreFiltro, setNombreFiltro] = useState(''); // Estado para filtro de nombre
    const [limiteCreditoMinimoFiltro, setLimiteCreditoMinimoFiltro] = useState(''); // Estado para filtro de límite de crédito mínimo
    const [limiteCreditoMaximoFiltro, setLimiteCreditoMaximoFiltro] = useState(''); // Estado para filtro de límite de crédito máximo

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = () => {
        axios.get('http://localhost:3001/api/clientes')
            .then(response => {
                console.log("Clientes obtenidos:", response.data);
                setClientes(response.data);
            })
            .catch(error => console.error("Error al obtener los clientes:", error));
    };

    const agregarCliente = (nuevoCliente) => {
        setClientes(prevClientes => [...prevClientes, nuevoCliente]);
        setClienteCedula(null);
        setMostrarFormulario(false); // Oculta el formulario después de agregar
    };

    const actualizarCliente = (actualizadoCliente) => {
        setClientes(prevClientes =>
            prevClientes.map(cliente =>
                cliente.cedula === actualizadoCliente.cedula ? actualizadoCliente : cliente
            )
        );
        setClienteCedula(null); // Restablecer clienteCedula
        setMostrarFormulario(false); // Cerrar el formulario después de actualizar
    };

    const handleDelete = (cedula) => {
        const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este cliente?");
        
        if (isConfirmed) {
            axios.delete(`http://localhost:3001/api/clientes/${cedula}`)
                .then(() => {
                    alert('Cliente eliminado');
                    // Filtrar el cliente eliminado directamente en el estado
                    setClientes(prevClientes => prevClientes.filter(cliente => cliente.cedula !== cedula));
                })
                .catch(error => {
                    console.error("Error al eliminar el cliente:", cedula, error);
                    alert("Error al eliminar el cliente");
                });
        } else {
            console.log("Eliminación cancelada");
        }
    };

    const handleEdit = (cedula) => {
        setClienteCedula(cedula);
        setMostrarFormulario(true); // Muestra el formulario al editar
    };

    // Filtrar clientes según los criterios establecidos
    const clientesFiltrados = clientes.filter(cliente => {
        const cumpleCedula = cedulaFiltro ? cliente.cedula === cedulaFiltro : true;
        const cumpleNombre = nombreFiltro ? cliente.nombre.toLowerCase().includes(nombreFiltro.toLowerCase()) : true;
        const limiteCredito = parseFloat(cliente.limite_credito);
        const cumpleLimiteMinimo = limiteCreditoMinimoFiltro ? limiteCredito >= parseFloat(limiteCreditoMinimoFiltro) : true;
        const cumpleLimiteMaximo = limiteCreditoMaximoFiltro ? limiteCredito <= parseFloat(limiteCreditoMaximoFiltro) : true;

        return cumpleCedula && cumpleNombre && cumpleLimiteMinimo && cumpleLimiteMaximo;
    });

    // Función para limpiar los filtros
    const limpiarFiltros = () => {
        setCedulaFiltro('');
        setNombreFiltro('');
        setLimiteCreditoMinimoFiltro('');
        setLimiteCreditoMaximoFiltro('');
    };

    // Obtener un conjunto único de cédulas para el dropdown
    const cédulasUnicas = [...new Set(clientes.map(cliente => cliente.cedula))];

    return (
        <div className="lista">
            <h2>Lista de Clientes</h2>
            <div className="filtros-container"> {/* Contenedor para filtros */}
                <div className="filtro-select">
                    <label htmlFor="cedulaFiltro">Filtrar por Cédula:</label>
                    <select
                        id="cedulaFiltro"
                        value={cedulaFiltro}
                        onChange={(e) => setCedulaFiltro(e.target.value)}
                        className="filtro-input"
                    >
                        <option value="">Seleccionar cédula</option>
                        {cédulasUnicas.map((cedula) => (
                            <option key={cedula} value={cedula}>{cedula}</option>
                        ))}
                    </select>
                </div>
                <div className="filtro-nombre">
                    <label htmlFor="nombreFiltro">Filtrar por Nombre:</label>
                    <input
                        type="text"
                        id="nombreFiltro"
                        value={nombreFiltro}
                        onChange={(e) => setNombreFiltro(e.target.value)}
                        className="filtro-input"
                    />
                </div>
                <div className="filtro-montos">
                    <label htmlFor="limiteCreditoMinimoFiltro">Límite de Crédito Mínimo:</label>
                    <input
                        type="number"
                        id="limiteCreditoMinimoFiltro"
                        value={limiteCreditoMinimoFiltro}
                        onChange={(e) => setLimiteCreditoMinimoFiltro(e.target.value)}
                        className="filtro-input"
                    />
                    <label htmlFor="limiteCreditoMaximoFiltro">Límite de Crédito Máximo:</label>
                    <input
                        type="number"
                        id="limiteCreditoMaximoFiltro"
                        value={limiteCreditoMaximoFiltro}
                        onChange={(e) => setLimiteCreditoMaximoFiltro(e.target.value)}
                        className="filtro-input"
                    />
                </div>
                <button className="button-limpiar-filtros" onClick={limpiarFiltros}>
                    Limpiar Filtros
                </button>
            </div>
            {clientesFiltrados.length === 0 ? (
                <p className="lista-vacia">No hay clientes disponibles.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Cédula</th>
                            <th>Nombre</th>
                            <th>Límite de Crédito</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientesFiltrados.map((cliente) => (
                            <tr key={cliente.cedula}>
                                <td>{cliente.cedula}</td>
                                <td>{cliente.nombre}</td>                               
                                <td>${parseFloat(cliente.limite_credito).toFixed(2)}</td>
                                <td>{cliente.estado}</td>
                                <td>
                                    <div className="button-container">
                                        <button onClick={() => handleEdit(cliente.cedula)}>Editar</button>
                                        <button onClick={() => handleDelete(cliente.cedula)}>Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <button className="button-toggle-formulario" onClick={() => setMostrarFormulario(prev => !prev)}>
                {mostrarFormulario ? "Ocultar Formulario" : "Agregar nuevo"}
            </button>
            {mostrarFormulario && (
                <FormularioCliente
                    clienteCedula={clienteCedula}
                    fetchClientes={fetchClientes}
                    agregarCliente={agregarCliente}
                    actualizarCliente={actualizarCliente}
                    setClienteCedula={setClienteCedula}
                    setMostrarFormulario={setMostrarFormulario} // Añadir aquí
                />
            )}
        </div>
    );
};

export default ListaClientes;
