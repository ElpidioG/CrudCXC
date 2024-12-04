import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import FormularioTransaccion from '../Formularios/FormTransacciones';
import '../Styles/ListStyle.css';
import { AuthContext } from '../Contexts/AuthContext';
import jsPDF from 'jspdf'; // Importa jsPDF
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx'; // Importa la librería xlsx
import autoTable from 'jspdf-autotable'; // Importa autoTable para manejar tablas

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

    const exportarPDF = () => {
        const doc = new jsPDF();
        doc.text("Cuentas x Cobrar ISO715", 14, 10);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 20);
        doc.text("Lista de Transacciones", 14, 30);
        autoTable(doc, {
            head: [["Tipo Movimiento", "Tipo Documento", "Número Documento", "Fecha", "Cliente", "Monto"]],
            body: transaccionesFiltradasFinales.map(t => [
                t.tipo_movimiento,
                t.tipo_documento_id,
                t.numero_documento,
                t.fecha.split('T')[0],
                t.cliente_id,
                `$${parseFloat(t.monto).toFixed(2)}`
            ]),
            
        });
                    // Usuario logueado desde el contexto
                    const usuarioLogueado = username;

                    doc.text(`Usuario: ${usuarioLogueado}`, 14, 40); // Agregar el usuario logueado
        doc.save("Lista_Transacciones.pdf");
    };

    const exportarExcel = () => {
        const fechaActual = new Date().toLocaleDateString(); // Fecha actual
        const nombreEmpresa = "Cuentas x Cobrar ISO715"; // Nombre de la empresa
    
        // Crear los datos para exportar incluyendo encabezados personalizados
        const datosParaExportar = [
            { A: nombreEmpresa }, // Nombre de la empresa como primera fila
            { A: `Fecha: ${fechaActual}` }, // Fecha como segunda fila
            {}, // Fila vacía para separar
            { // Encabezados de la tabla
                Tipo_Movimiento: "Tipo Movimiento",
                Tipo_Documento: "Tipo Documento",
                Número_Documento: "Número Documento",
                Fecha: "Fecha",
                Cliente: "Cliente",
                Monto: "Monto"
            },
            ...transaccionesFiltradasFinales.map(t => ({
                Tipo_Movimiento: t.tipo_movimiento,
                Tipo_Documento: t.tipo_documento_id,
                Número_Documento: t.numero_documento,
                Fecha: t.fecha.split('T')[0],
                Cliente: t.cliente_id,
                Monto: `$${parseFloat(t.monto).toFixed(2)}`
            }))
        ];
    
        // Crear la hoja de Excel a partir de los datos
        const hoja = XLSX.utils.json_to_sheet(datosParaExportar, { skipHeader: true });
    
        // Ajustar estilo de las columnas si es necesario (opcional)
        const libro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(libro, hoja, "Transacciones");
    
        // Descargar el archivo
        XLSX.writeFile(libro, `Lista_Transacciones_${fechaActual.replace(/\//g, '-')}.xlsx`);
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
