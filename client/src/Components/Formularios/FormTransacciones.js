
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/FormStyle.css'; // Estilos

const FormularioTransaccion = ({ transaccionId, agregarTransaccion, fetchTransacciones, actualizarTransaccion, setTransaccionId }) => {
    const [formData, setFormData] = useState({
        tipo_movimiento: '',
        tipo_documento_id: '',
        numero_documento: '',
        fecha: '',
        cliente_id: '',
        monto: 0
    });

    const [tiposDocumentos, setTiposDocumentos] = useState([]); // Estado para tipos de documentos
    const [clientes, setClientes] = useState([]); // Estado para clientes

    useEffect(() => {
        // Cargar tipos de documentos
        axios.get('http://localhost:3001/api/tipos_documentosid')
            .then(response => setTiposDocumentos(response.data))
            .catch(error => console.error("Error al obtener tipos de documentos:", error));

        // Cargar clientes
        axios.get('http://localhost:3001/api/clientesid')
            .then(response => setClientes(response.data))
            .catch(error => console.error("Error al obtener clientes:", error));

        if (transaccionId) {

            axios.get(`http://localhost:3001/api/transacciones/${transaccionId}`)
                .then(response => {
                    const transaccionData = response.data;

                    // Cambiar formato a fecha
                    const formattedDate = transaccionData.fecha.split('T')[0];

                    // Colocar los datos en el formulario
                    setFormData({
                        tipo_movimiento: transaccionData.tipo_movimiento,
                        tipo_documento_id: transaccionData.tipo_documento_id,
                        numero_documento: transaccionData.numero_documento,
                        fecha: formattedDate,
                        cliente_id: transaccionData.cliente_id,
                        monto: transaccionData.monto
                    });
                })
                .catch(error => {
                    console.error("Error al obtener transacción:", error);
                    alert("Error al obtener transacción");
                });
        } else {
            // Si no hay transaccionId, reiniciar el formulario
            setFormData({
                tipo_movimiento: '',
                tipo_documento_id: '',
                numero_documento: '',
                fecha: '',
                cliente_id: '',
                monto: 0
            });
        }
    }, [transaccionId]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (transaccionId) {
            // Update transacción existente
            axios.put(`http://localhost:3001/api/transacciones/${transaccionId}`, formData)
                .then(response => {
                    alert('Transacción actualizada');
                    actualizarTransaccion(response.data); // Update la transacción en la lista
                    setFormData({
                        tipo_movimiento: '',
                        tipo_documento_id: '',
                        numero_documento: '',
                        fecha: '',
                        cliente_id: '',
                        monto: 0
                    });
                    setTransaccionId(null); // Reiniciar ID después de actualizar
                })
                .catch(error => {
                    console.error("Error al actualizar la transacción:", error);
                });
        } else {
            // Crear nueva transacción
            axios.post('http://localhost:3001/api/transacciones', formData)
                .then(response => {
                    alert('Transacción creada');
                    agregarTransaccion(response.data); // Agregar la nueva transacción a la lista
                    setFormData({ // Reinicia el formulario
                        tipo_movimiento: '',
                        tipo_documento_id: '',
                        numero_documento: '',
                        fecha: '',
                        cliente_id: '',
                        monto: 0
                    });
                    fetchTransacciones(); // Refresca la lista
                })
                .catch(error => {
                    console.error("Error al crear la transacción:", error);
                });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{transaccionId ? 'Actualizar Transacción' : 'Registrar nueva transacción'}</h2>
            <div>
                <label>Tipo de Movimiento</label>
                <select name="tipo_movimiento" value={formData.tipo_movimiento} onChange={handleInputChange} required>
                    <option value="">Selecciona un tipo de movimiento</option>
                    <option value="DB">Débito</option>
                    <option value="CR">Crédito</option>
                </select>
            </div>
            <div>
                <label>Tipo de Documento</label>
                <select name="tipo_documento_id" value={formData.tipo_documento_id} onChange={handleInputChange} required>
                    <option value="">Selecciona un tipo de documento</option>
                    {tiposDocumentos.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>{tipo.id}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Número de Documento</label>
                <input type="text" name="numero_documento" value={formData.numero_documento} onChange={handleInputChange} required />
            </div>
            <div>
                <label>Fecha</label>
                <input type="date" name="fecha" value={formData.fecha} onChange={handleInputChange} required />
            </div>
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
                <label>Monto</label>
                <input type="number" name="monto" value={formData.monto} onChange={handleInputChange} required />
            </div>
            <button type="submit">{transaccionId ? 'Actualizar' : 'Crear'}</button>
        </form>
    );
};

export default FormularioTransaccion;
