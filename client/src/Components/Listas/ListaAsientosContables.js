import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormularioAsientoContable from '../Formularios/FormAsientosContables';
import '../Styles/ListStyle.css';

const ListaAsientosContables = () => {
    const [asientosContables, setAsientosContables] = useState([]);
    const [asientoContableId, setAsientoContableId] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    useEffect(() => {
        fetchAsientosContables();
    }, []);

    const fetchAsientosContables = () => {
        axios.get('http://localhost:3001/api/asientos_contables')
            .then(response => setAsientosContables(response.data))
            .catch(error => console.error(error));
    };

    const agregarAsientoContable = (nuevoAsientoContable) => {
        setAsientosContables(prevAsientosContables => [...prevAsientosContables, nuevoAsientoContable]);
        setAsientoContableId(null);
    };

    const actualizarAsientoContable = (actualizadoAsientoContable) => {
        setAsientosContables(prevAsientosContables => 
            prevAsientosContables.map(asiento => 
                asiento.id === actualizadoAsientoContable.id ? actualizadoAsientoContable : asiento
            )
        );
        setAsientoContableId(null);
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

    const toggleFormulario = () => {
        setMostrarFormulario(!mostrarFormulario);
    };

    return (
        <div className="lista">
            <h2>Lista de Asientos Contables</h2>
            {asientosContables.length === 0 ? (
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
                        {asientosContables.map((asientoContable) => (
                            <tr key={asientoContable.id}>
                                <td>{asientoContable.cliente_id}</td>
                                <td>{asientoContable.descripcion}</td>
                                <td>{asientoContable.fecha.split('T')[0]}</td> 
                                <td>${parseFloat(asientoContable.monto).toFixed(2)}</td>
                                <td>{asientoContable.tipo_movimiento}</td>
                                <td>
                                    <div className="button-container">
                                        <button onClick={() => setAsientoContableId(asientoContable.id)}>Editar</button>
                                        <button onClick={() => handleDelete(asientoContable.id)}>Eliminar</button>
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
                <FormularioAsientoContable 
                    asientoContableId={asientoContableId}
                    fetchAsientosContables={fetchAsientosContables} 
                    agregarAsientoContable={agregarAsientoContable} 
                    actualizarAsientoContable={actualizarAsientoContable} 
                    setAsientoContableId={setAsientoContableId}
                />
            )}
        </div>
    );
};

export default ListaAsientosContables;
