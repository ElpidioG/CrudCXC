import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormularioTipoDocumento from '../Formularios/FormTipoDocumento';
import '../Styles/ListStyle.css';

const ListaTiposdedocumentos = () => {
    const [tiposdedocumentos, setTiposdedocumentos] = useState([]);
    const [tipoDocumentoId, setTipoDocumentoId] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    useEffect(() => {
        fetchTipoDocumento();
    }, []);

    const fetchTipoDocumento = () => {
        axios.get('http://localhost:3001/api/tipos_documentos')
            .then(response => {
                console.log("Tipos de documentos obtenidos:", response.data);
                setTiposdedocumentos(response.data);
            })
            .catch(error => console.error("Error al obtener los tipos de documentos:", error));
    };

    const agregarTipoDocumento = (nuevoTiposdedocumentos) => {
        setTiposdedocumentos(prevTiposdedocumentos => [...prevTiposdedocumentos, nuevoTiposdedocumentos]);
        setTipoDocumentoId(null);
    };

    const actualizarTiposdedocumentos = (actualizadoTiposdedocumentos) => {
        setTiposdedocumentos(prevTiposdedocumentos => 
            prevTiposdedocumentos.map(tiposdedocumento => 
                tiposdedocumento.id === actualizadoTiposdedocumentos.id ? actualizadoTiposdedocumentos : tiposdedocumento
            )
        );
        setTipoDocumentoId(null);
    };

    const handleDelete = (tipoDocumentoId) => {
        const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este tipo de documento?");
        
        if (isConfirmed) {
            axios.delete(`http://localhost:3001/api/tipos_documentos/${tipoDocumentoId}`)
                .then(() => {
                    alert('Tipo de documento eliminado');
                    fetchTipoDocumento();
                })
                .catch(error => {
                    console.error("Error al eliminar el tipo de documento:", error);
                    alert("Error al eliminar el tipo de documento");
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
            <h2>Lista de Tipos de Documentos</h2>
            {tiposdedocumentos.length === 0 ? (
                <p className="lista-vacia">No hay tipos de documentos disponibles.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Descripción</th>
                            <th>Cuenta Contable</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tiposdedocumentos.map((tiposdedocumento) => (
                            <tr key={tiposdedocumento.id}>
                                <td>{tiposdedocumento.descripcion}</td>
                                <td>{tiposdedocumento.cuenta_contable}</td>
                                <td>{tiposdedocumento.estado}</td>
                                <td>
                                    <div className="button-container">
                                        <button onClick={() => setTipoDocumentoId(tiposdedocumento.id)}>Editar</button>
                                        <button onClick={() => handleDelete(tiposdedocumento.id)}>Eliminar</button>
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
                <FormularioTipoDocumento 
                    tipoDocumentoId={tipoDocumentoId} 
                    fetchTipoDocumento={fetchTipoDocumento} 
                    agregarTipoDocumento={agregarTipoDocumento} 
                    actualizarTiposdedocumentos={actualizarTiposdedocumentos} 
                    setTipoDocumentoId={setTipoDocumentoId} 
                />
            )}
        </div>
    );
};

export default ListaTiposdedocumentos;
