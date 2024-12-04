import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormularioTipoDocumento from '../Formularios/FormTipoDocumento';
import '../Styles/ListStyle.css';
import jsPDF from 'jspdf'; // Importa jsPDF
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx'; // Importa la librería xlsx
import autoTable from 'jspdf-autotable'; // Importa autoTable para manejar tablas

const ListaTiposdedocumentos = () => {
    const [tiposdedocumentos, setTiposdedocumentos] = useState([]);
    const [tipoDocumentoId, setTipoDocumentoId] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    
    // Estados para los filtros
    const [descripcionFiltro, setDescripcionFiltro] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');

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

    const handleEdit = (tipoDocumento) => {
        setTipoDocumentoId(tipoDocumento.id);
        setMostrarFormulario(true); // Mostrar el formulario al editar
    };

    const toggleFormulario = () => {
        setMostrarFormulario(!mostrarFormulario);
    };

    // Función para limpiar los filtros
    const limpiarFiltros = () => {
        setDescripcionFiltro('');
        setEstadoFiltro('');
    };

    // Filtrar los tipos de documentos
    const tiposdedocumentosFiltrados = tiposdedocumentos.filter(tiposdedocumento => {
        const cumpleDescripcion = tiposdedocumento.descripcion.toLowerCase().includes(descripcionFiltro.toLowerCase());
        const cumpleEstado = estadoFiltro ? tiposdedocumento.estado === estadoFiltro : true;

        return cumpleDescripcion && cumpleEstado;
    });

    const exportarPDF = () => {
        const doc = new jsPDF();
        const nombreEmpresa = "Cuentas x Cobrar ISO715";
        const fechaActual = new Date().toLocaleDateString();

        // Encabezado
        doc.setFontSize(14);
        doc.text(nombreEmpresa, 14, 15);
        doc.setFontSize(12);
        doc.text(`Fecha: ${fechaActual}`, 14, 25);
        

        // Datos de la tabla
        const datosTabla = tiposdedocumentosFiltrados.map(tiposdedocumento => [
            tiposdedocumento.id,
            tiposdedocumento.descripcion,
            tiposdedocumento.cuenta_contable,
            tiposdedocumento.estado,
        ]);

        // Tabla
        autoTable(doc, {
            startY: 35,
            head: [['ID', 'Descripción', 'Cuenta Contable', 'Estado']],
            body: datosTabla,
        });

        // Guardar PDF
        doc.save(`Tipos_de_Documentos_${fechaActual}.pdf`);
    };

    const exportarExcel = () => {
        const nombreEmpresa = "Cuentas x Cobrar ISO715";
        const fechaActual = new Date().toLocaleDateString();

        const worksheetData = [
            [nombreEmpresa],
            [`Fecha: ${fechaActual}`],
            ['ID', 'Descripción', 'Cuenta Contable', 'Estado'],
            ...tiposdedocumentosFiltrados.map(tiposdedocumento => [
                tiposdedocumento.id,
                tiposdedocumento.descripcion,
                tiposdedocumento.cuenta_contable,
                tiposdedocumento.estado,
            ]),
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tipos de Documentos');
        XLSX.writeFile(workbook, `Tipos_de_Documentos_${fechaActual}.xlsx`);
    };


    return (
        <div className="lista">
            <h2>Lista de Tipos de Documentos</h2>
            <div className="filtros-container"> {/* Contenedor para filtros */}
                <div className="filtro-input">
                    <label htmlFor="descripcionFiltro">Filtrar por Descripción:</label>
                    <input
                        type="text"
                        id="descripcionFiltro"
                        value={descripcionFiltro}
                        onChange={(e) => setDescripcionFiltro(e.target.value)}
                        className="filtro-input" // Clase para el estilo
                    />
                </div>
                <div className="filtro-select">
                    <label htmlFor="estadoFiltro">Filtrar por Estado:</label>
                    <select
                        id="estadoFiltro"
                        value={estadoFiltro}
                        onChange={(e) => setEstadoFiltro(e.target.value)}
                        className="filtro-select" // Clase para el estilo
                    >
                        <option value="">Todos</option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                </div>
                <button className="button-limpiar-filtros" onClick={limpiarFiltros}>
                    Limpiar Filtros
                </button>
            </div>

            {tiposdedocumentosFiltrados.length === 0 ? (
                <p className="lista-vacia">No hay tipos de documentos disponibles.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Descripción</th>
                            <th>Cuenta Contable</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tiposdedocumentosFiltrados.map((tiposdedocumento) => (
                            <tr key={tiposdedocumento.id}>
                                <td>{tiposdedocumento.id}</td>
                                <td>{tiposdedocumento.descripcion}</td>
                                <td>{tiposdedocumento.cuenta_contable}</td>
                                <td>{tiposdedocumento.estado}</td>
                                <td>
                                    <div className="button-container">
                                        <button onClick={() => handleEdit(tiposdedocumento)}>Editar</button>
                                        <button onClick={() => handleDelete(tiposdedocumento.id)}>Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            
            <div className="botones-container">
    <button onClick={exportarPDF} className="button-exportar-pdf">
        <FaFilePdf size={24} />
        Exportar a PDF
    </button>
    <button onClick={exportarExcel} className="button-exportar-excel">
        <FaFileExcel size={24} />
        Exportar a Excel
    </button>
    <button className="button-toggle-formulario" onClick={toggleFormulario}>
                {mostrarFormulario ? "Ocultar Formulario" : "Agregar nuevo"}
            </button>
</div>
            
           
         
            {mostrarFormulario && (
                <FormularioTipoDocumento 
                    tipoDocumentoId={tipoDocumentoId} 
                    fetchTipoDocumento={fetchTipoDocumento} 
                    agregarTipoDocumento={agregarTipoDocumento} 
                    actualizarTiposdedocumentos={actualizarTiposdedocumentos} 
                    setTipoDocumentoId={setTipoDocumentoId} 
                    setMostrarFormulario={setMostrarFormulario} 
                />
            )}
        </div>
    );
};

export default ListaTiposdedocumentos;
