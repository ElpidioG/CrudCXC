import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormularioBalance from '../Formularios/FormBalances';
import '../Styles/ListStyle.css';

const ListaBalances = () => {
    const [balances, setBalances] = useState([]);
    const [balanceId, setBalanceId] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    useEffect(() => {
        fetchBalances();
    }, []);

    const fetchBalances = () => {
        axios.get('http://localhost:3001/api/balances')
            .then(response => setBalances(response.data))
            .catch(error => console.error(error));
    };

    const agregarBalance = (nuevoBalance) => {
        setBalances(prevBalances => [...prevBalances, nuevoBalance]);
        setBalanceId(null);
    };

    const actualizarBalance = (actualizadoBalance) => {
        setBalances(prevBalances => 
            prevBalances.map(balance => 
                balance.id === actualizadoBalance.id ? actualizadoBalance : balance
            )
        );
        setBalanceId(null);
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
    };

    return (
        <div className="lista">
            <h2>Lista de Balances</h2>
            {balances.length === 0 ? (
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
                        {balances.map((balance) => (
                            <tr key={balance.id}>
                                <td>{balance.cliente_id}</td>
                                <td>{balance.fecha_corte.split('T')[0]}</td> 
                                <td>${parseFloat(balance.monto).toFixed(2)}</td>
                                <td>
                                    <div className="button-container">
                                        <button onClick={() => setBalanceId(balance.id)}>Editar</button>
                                        <button onClick={() => handleDelete(balance.id)}>Eliminar</button>
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
                <FormularioBalance 
                    balanceId={balanceId}
                    fetchBalances={fetchBalances} 
                    agregarBalance={agregarBalance} 
                    actualizarBalance={actualizarBalance} 
                    setBalanceId={setBalanceId}
                />
            )}
        </div>
    );
};

export default ListaBalances;
