import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormularioCliente from '../Formularios/FormClientes';
import '../Styles/ListStyle.css';

const ListaClientes = () => {
    const [clientes, setClientes] = useState([]);
    const [clienteId, setClienteId] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

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
        setClienteId(null);
    };

    const actualizarCliente = (actualizadoCliente) => {
        setClientes(prevClientes =>
            prevClientes.map(cliente =>
                cliente.id === actualizadoCliente.id ? actualizadoCliente : cliente
            )
        );
        setClienteId(null);
    };

    const handleDelete = (clienteId) => {
        const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este cliente?");
        
        if (isConfirmed) {
            axios.delete(`http://localhost:3001/api/clientes/${clienteId}`)
                .then(() => {
                    alert('Cliente eliminado');
                    fetchClientes();
                })
                .catch(error => {
                    console.error("Error al eliminar el cliente:", error);
                    alert("Error al eliminar el cliente");
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
            <h2>Lista de Clientes</h2>
            {clientes.length === 0 ? (
                <p className="lista-vacia">No hay clientes disponibles.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Cédula</th>
                            <th>Límite de Crédito</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map((cliente) => (
                            <tr key={cliente.id}>
                                <td>{cliente.nombre}</td>
                                <td>{cliente.cedula}</td>
                                <td>${parseFloat(cliente.limite_credito).toFixed(2)}</td>
                                <td>{cliente.estado}</td>
                                <td>
                                    <div className="button-container">
                                        <button onClick={() => setClienteId(cliente.id)}>Editar</button>
                                        <button onClick={() => handleDelete(cliente.id)}>Eliminar</button>
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
                <FormularioCliente
                    clienteId={clienteId}
                    fetchClientes={fetchClientes}
                    agregarCliente={agregarCliente}
                    actualizarCliente={actualizarCliente}
                    setClienteId={setClienteId}
                />
            )}
        </div>
    );
};

export default ListaClientes;
