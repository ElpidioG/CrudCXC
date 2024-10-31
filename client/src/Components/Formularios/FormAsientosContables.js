import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/FormStyle.css'; // Estilos

const FormularioAsientoContable = ({ asientoContableId, agregarAsientoContable, fetchAsientosContables, setAsientoContableId, setMostrarFormulario }) => {
    const [formData, setFormData] = useState({
        cliente_id: '',
        fecha: '',
        descripcion: '',
        monto: 0,
        tipo_movimiento: ''
    });

    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/api/clientesid')
            .then(response => setClientes(response.data))
            .catch(error => console.error("Error al obtener clientes:", error));

        if (asientoContableId) {
            axios.get(`http://localhost:3001/api/asientos_contables/${asientoContableId}`)
                .then(response => {
                    const asientoContableData = response.data;
                    const formattedDate = asientoContableData.fecha.split('T')[0];

                    setFormData({
                        cliente_id: asientoContableData.cliente_id,
                        fecha: formattedDate,
                        descripcion: asientoContableData.descripcion,
                        monto: asientoContableData.monto,
                        tipo_movimiento: asientoContableData.tipo_movimiento
                    });
                })
                .catch(error => {
                    console.error("Error al obtener Asiento Contable:", error);
                    alert("Error al obtener Asiento Contable");
                });
        } else {
            setFormData({
                cliente_id: '',
                fecha: '',
                descripcion: '',
                monto: 0,
                tipo_movimiento: ''
            });
        }
    }, [asientoContableId]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.monto < 0) {
            alert('El monto no puede ser negativo.');
            return;
        }

        if (asientoContableId) {
            axios.put(`http://localhost:3001/api/asientos_contables/${asientoContableId}`, formData)
                .then(response => {
                    alert('Asiento Contable actualizado');
                    fetchAsientosContables();
                    setAsientoContableId(null);
                    setMostrarFormulario(false);
                })
                .catch(error => {
                    console.error("Error al actualizar el Asiento Contable:", error);
                });
        } else {
            axios.post('http://localhost:3001/api/asientos_contables', formData)
                .then(response => {
                    alert('Asiento Contable creado');
                    agregarAsientoContable(response.data);
                    fetchAsientosContables();
                })
                .catch(error => {
                    console.error("Error al crear el Asiento Contable:", error);
                });
        }

        setFormData({
            cliente_id: '',
            fecha: '',
            descripcion: '',
            monto: 0,
            tipo_movimiento: ''
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{asientoContableId ? 'Actualizar Asiento Contable' : 'Registrar nuevo Asiento Contable'}</h2>
            <div>
                <label>Cliente ID</label>
                <select name="cliente_id" value={formData.cliente_id} onChange={handleInputChange} required>
                    <option value="">Selecciona un cliente</option>
                    {clientes.map(cliente => (
                        <option key={cliente.id} value={cliente.id}>{cliente.cedula}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Descripción</label>
                <input type="text" name="descripcion" value={formData.descripcion} onChange={handleInputChange} />
            </div>
            <div>
                <label>Fecha</label>
                <input type="date" name="fecha" value={formData.fecha} onChange={handleInputChange} />
            </div>
            <div>
                <label>Monto</label>
                <input type="number" name="monto" value={formData.monto} onChange={handleInputChange} />
            </div>
            <div>
                <label>Tipo de Movimiento</label>
                <select name="tipo_movimiento" value={formData.tipo_movimiento} onChange={handleInputChange} required>
                    <option value="">Selecciona un tipo de movimiento</option>
                    <option value="DB">Débito</option>
                    <option value="CR">Crédito</option>
                </select>
            </div>
            <button type="submit">{asientoContableId ? 'Actualizar' : 'Crear'}</button>
        </form>
    );
};

export default FormularioAsientoContable;
