import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/FormStyle.css'; // Estilos

const FormularioBalance = ({ balanceId, agregarBalance, fetchBalances, setBalanceId }) => {
    const [formData, setFormData] = useState({
        cliente_id: '',
        fecha_corte: '',
        antiguedad_promedio_saldos: '',
        monto: 0
    });

    const [clientes, setClientes] = useState([]); // Nuevo estado para los clientes

    useEffect(() => {
        axios.get('http://localhost:3001/api/clientesid') // Cargar lista de clientes
            .then(response => setClientes(response.data))
            .catch(error => console.error("Error al obtener clientes:", error));

        if (balanceId) {

            axios.get(`http://localhost:3001/api/balances/${balanceId}`)
                .then(response => {
                    const balanceData = response.data;

                    // Cambiar formato de la fecha
                    const formattedDate = balanceData.fecha_corte.split('T')[0];

                    // Establecer los datos en el formulario
                    setFormData({
                        cliente_id: balanceData.cliente_id,
                        fecha_corte: formattedDate,
                        antiguedad_promedio_saldos: balanceData.antiguedad_promedio_saldos,
                        monto: balanceData.monto
                    });
                })
                .catch(error => {
                    console.error("Error al obtener balance:", error); // Error case
                    alert("Error al obtener balance");
                });
        } else {
            // Reiniciar el formulario
            setFormData({
                cliente_id: '',
                fecha_corte: '',
                antiguedad_promedio_saldos: '',
                monto: 0
            });
        }
    }, [balanceId]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (balanceId) {
            // Update balance existente
            axios.put(`http://localhost:3001/api/balances/${balanceId}`, formData)
                .then(response => {
                    alert('Balance actualizado');
                    fetchBalances(); // Refresca la lista 
                    setFormData({
                        cliente_id: '',
                        fecha_corte: '',
                        antiguedad_promedio_saldos: '',
                        monto: 0
                    });
                    setBalanceId(null); // Reiniciar ID después de actualizar
                })
                .catch(error => {
                    console.error("Error al actualizar el balance:", error);
                });
        } else {
            // Crear nuevo balance
            axios.post('http://localhost:3001/api/balances', formData)
                .then(response => {
                    alert('Balance creado');
                    agregarBalance(response.data); // Agregar el nuevo balance a la lista
                    setFormData({ // Reinicia el formulario
                        cliente_id: '',
                        fecha_corte: '',
                        antiguedad_promedio_saldos: '',
                        monto: 0
                    });
                    fetchBalances(); // Refresca la lista
                })
                .catch(error => {
                    console.error("Error al crear el balance:", error);
                });
        }
    };

    return (
        // Form de actualizar o agregar dependiendo el caso
        <form onSubmit={handleSubmit}>
            <h2>{balanceId ? 'Actualizar Balance' : 'Registrar nuevo balance'}</h2>
            <div>
                <label>Cliente ID</label>
                <select name="cliente_id" value={formData.cliente_id} onChange={handleInputChange} required>
                    <option value="">Selecciona un cliente</option>
                    {clientes.map(cliente => (
                        <option key={cliente.id} value={cliente.id}>{cliente.id}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Fecha de Corte</label>
                <input type="date" name="fecha_corte" value={formData.fecha_corte} onChange={handleInputChange} />
            </div>
            <div>
                <label>Antigüedad Promedio de Saldos</label>
                <input type="text" name="antiguedad_promedio_saldos" value={formData.antiguedad_promedio_saldos} onChange={handleInputChange} />
            </div>
            <div>
                <label>Monto</label>
                <input type="number" name="monto" value={formData.monto} onChange={handleInputChange} />
            </div>
            <button type="submit">{balanceId ? 'Actualizar' : 'Crear'}</button>
        </form>
    );
};

export default FormularioBalance;
