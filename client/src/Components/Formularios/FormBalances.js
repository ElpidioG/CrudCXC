import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/FormStyle.css'; // Estilos

const FormularioBalance = ({ balanceId, agregarBalance, fetchBalances, setBalanceId, setMostrarFormulario }) => { 
    const [formData, setFormData] = useState({
        cedula: '', 
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
                        cedula: balanceData.cliente_id, // Cambiado de cliente_id a cedula
                        fecha_corte: formattedDate,
                        antiguedad_promedio_saldos: balanceData.antiguedad_promedio_saldos,
                        monto: balanceData.monto
                    });
                })
                .catch(error => {
                    console.error("Error al obtener balance:", error);
                    alert("Error al obtener balance");
                });
        } else {
            // Reiniciar el formulario
            setFormData({
                cedula: '',  // Cambiado de cliente_id a cedula
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

        // Preparar el objeto a enviar, asegurando que la propiedad se llama 'cliente_id'
        const { cedula, ...rest } = formData;
        const dataToSubmit = {
            cliente_id: cedula, // Mapea cedula a cliente_id
            ...rest
        };

        if (balanceId) {
            // Update balance existente
            axios.put(`http://localhost:3001/api/balances/${balanceId}`, dataToSubmit)
                .then(response => {
                    alert('Balance actualizado');
                    fetchBalances(); // Refresca la lista 
                    setFormData({
                        cedula: '', // Cambiado de cliente_id a cedula
                        fecha_corte: '',
                        antiguedad_promedio_saldos: '',
                        monto: 0
                    });
                    setBalanceId(null); // Reiniciar ID después de actualizar
                    setMostrarFormulario(false); // Ocultar formulario después de actualizar
                })
                .catch(error => {
                    console.error("Error al actualizar el balance:", error);
                });
        } else {
            // Crear nuevo balance
            axios.post('http://localhost:3001/api/balances', dataToSubmit)
                .then(response => {
                    alert('Balance creado');
                    agregarBalance(response.data); // Agregar el nuevo balance a la lista
                    setFormData({ // Reinicia el formulario
                        cedula: '', // Cambiado de cliente_id a cedula
                        fecha_corte: '',
                        antiguedad_promedio_saldos: '',
                        monto: 0
                    });
                    fetchBalances(); // Refresca la lista
                    setMostrarFormulario(false); // Ocultar formulario después de actualizar
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
                <label>Cédula</label>
                <select name="cedula" value={formData.cedula} onChange={handleInputChange} required>
                    <option value="">Selecciona un cliente</option>
                    {clientes.map(cliente => (
                        <option key={cliente.id} value={cliente.cedula}>{cliente.cedula}</option> 
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
