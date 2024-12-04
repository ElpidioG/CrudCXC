import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import FormularioBalance from '../Formularios/FormBalances';
import '../Styles/ListStyle.css';
import { AuthContext } from '../Contexts/AuthContext';
import jsPDF from 'jspdf'; // Importa jsPDF
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx'; // Importa la librería xlsx
import autoTable from 'jspdf-autotable'; // Importa autoTable para manejar tablas

const ListaBalances = () => {
    const [balances, setBalances] = useState([]);
    const [balanceId, setBalanceId] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [clienteIdFiltro, setClienteIdFiltro] = useState('');
    const [fechaCorteFiltro, setFechaCorteFiltro] = useState('');
    const [montoMinimoFiltro, setMontoMinimoFiltro] = useState('');
    const [montoMaximoFiltro, setMontoMaximoFiltro] = useState('');
    const { role, username } = useContext(AuthContext);

    useEffect(() => {
        fetchBalances();
    }, []);

    const fetchBalances = () => {
        axios.get('http://localhost:3001/api/balances')
            .then(response => setBalances(response.data))
            .catch(error => console.error(error));
    };

    const balancesFiltrados = balances.filter(balance => {
        if (role === 'user') {
            return balance.cliente_id === username;
        }
        return true;
    });

    const balancesFiltradosPorClienteId = clienteIdFiltro
        ? balancesFiltrados.filter(balance => balance.cliente_id === clienteIdFiltro)
        : balancesFiltrados;

    const balancesFiltradosPorFechaCorte = fechaCorteFiltro
        ? balancesFiltradosPorClienteId.filter(balance => 
            balance.fecha_corte.split('T')[0] === fechaCorteFiltro
        )
        : balancesFiltradosPorClienteId;

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
        setMostrarFormulario(false);
    };

    const actualizarBalance = (actualizadoBalance) => {
        setBalances(prevBalances => 
            prevBalances.map(balance => 
                balance.id === actualizadoBalance.id ? actualizadoBalance : balance
            )
        );
        setBalanceId(null);
        setMostrarFormulario(false);
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
            setBalanceId(null);
        }
    };

    const limpiarFiltros = () => {
        setClienteIdFiltro('');
        setFechaCorteFiltro('');
        setMontoMinimoFiltro('');
        setMontoMaximoFiltro('');
    };



    const exportarPDF = () => {
        const doc = new jsPDF();
        const nombreEmpresa = "Cuentas x Cobrar IS0715"; 
        const fechaActual = new Date().toLocaleDateString();
    
        // Encabezado
        doc.setFontSize(14);
        doc.text(nombreEmpresa, 14, 15);
        doc.setFontSize(12);
        doc.text(`Fecha: ${fechaActual}`, 14, 25);
                    // Usuario logueado desde el contexto
                    const usuarioLogueado = username;

                    doc.text(`Usuario: ${usuarioLogueado}`, 14, 40); // Agregar el usuario logueado
    
        // Datos de la tabla
        const datosTabla = balancesFiltradosFinales.map(balance => [
            balance.cliente_id,
            balance.nombre,
            balance.fecha_corte.split('T')[0],
            balance.antiguedad_promedio_saldos,
            `$${parseFloat(balance.monto).toFixed(2)}`,
        ]);
    
        // Configurar la tabla
        autoTable(doc, {
            startY: 35,
            head: [['Cliente ID', 'Nombre del Cliente', 'Fecha de Corte', 'Antigüedad', 'Monto']],
            body: datosTabla,
        });
    
        // Guardar archivo PDF
        doc.save(`Reporte_Balances_${fechaActual}.pdf`);
    };
    
    const exportarExcel = () => {
        const nombreEmpresa = "Cuentas x Cobrar IS0715"; 
        const fechaActual = new Date().toLocaleDateString();
    
        const worksheetData = [
            [nombreEmpresa],
            [`Fecha: ${fechaActual}`],
            ['Cliente ID', 'Nombre del Cliente', 'Fecha de Corte', 'Antigüedad', 'Monto'],
            ...balancesFiltradosFinales.map(balance => [
                balance.cliente_id,
                balance.nombre,
                balance.fecha_corte.split('T')[0],
                balance.antiguedad_promedio_saldos,
                parseFloat(balance.monto).toFixed(2),
            ]),
        ];
    
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Balances');
        XLSX.writeFile(workbook, `Reporte_Balances_${fechaActual}.xlsx`);
    };
    return (
        <div className="lista">
            <h2>Lista de Balances</h2>
            <div className="filtros-container">
                <div className="filtro-fecha">
                    <label htmlFor="fechaCorteFiltro">Filtrar por Fecha de Corte:</label>
                    <input
                        type="date"
                        id="fechaCorteFiltro"
                        value={fechaCorteFiltro}
                        onChange={(e) => setFechaCorteFiltro(e.target.value)}
                        className="filtro-input"
                    />
                </div>
                {role !== 'user' && (
                    <div className="filtro-input">
                        <label htmlFor="clienteIdFiltro">Filtrar por Cliente ID:</label>
                        <select
                            id="clienteIdFiltro"
                            value={clienteIdFiltro}
                            onChange={(e) => setClienteIdFiltro(e.target.value)}
                            className="filtro-select"
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
            {balancesFiltradosFinales.length === 0 ? (
                <p className="lista-vacia">No hay balances disponibles.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Cliente ID</th>
                            <th>Nombre del Cliente</th>
                            <th>Fecha de Corte</th>
                            <th>Antigüedad Promedio</th>
                            <th>Monto</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {balancesFiltradosFinales.map((balance) => (
                            <tr key={balance.id}>
                                <td>{balance.cliente_id}</td>
                                <td>{balance.nombre}</td> {/* Mostrar el nombre del cliente */}
                                <td>{balance.fecha_corte.split('T')[0]}</td>
                                <td>{balance.antiguedad_promedio_saldos}</td>
                                <td>${parseFloat(balance.monto).toFixed(2)}</td>
                                <td>
                                    <div className="button-container">
                                        {role !== 'user' ? (
                                            <>
                                                <button onClick={() => {
                                                    setBalanceId(balance.id);
                                                    setMostrarFormulario(true);
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
                        <div className="botones-container">
    <button onClick={exportarPDF} className="button-exportar-pdf">
        <FaFilePdf size={24} />
        Exportar a PDF
    </button>
    <button onClick={exportarExcel} className="button-exportar-excel">
        <FaFileExcel size={24} />
        Exportar a Excel
    </button>
</div>
            {role !== 'user' && (
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
