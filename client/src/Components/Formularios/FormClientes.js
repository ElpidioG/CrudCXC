import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/FormStyle.css'; // Estilos

const FormularioCliente = ({ clienteId, agregarCliente, fetchClientes, setClienteId }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        cedula: '',
        limite_credito: 0,
        estado: 'Activo'
    });

    useEffect(() => {
        if (clienteId) {
            axios.get(`http://localhost:3001/api/clientes/${clienteId}`)
                .then(response => {
                    const clienteData = response.data;
                    setFormData({
                        nombre: clienteData.nombre,
                        cedula: clienteData.cedula,
                        limite_credito: clienteData.limite_credito,
                        estado: clienteData.estado
                    });
                })
                .catch(error => {
                    console.error("Error al obtener cliente:", error);
                    alert("Error al obtener cliente");
                });
        } else {
            setFormData({
                nombre: '',
                cedula: '',
                limite_credito: 0,
                estado: 'Activo'
            });
        }
    }, [clienteId]);

    const isValidCedula = (cedula) => {
        if (!/^\d{11}$/.test(cedula)) return false;
        
        let sum = 0;
        const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1];

        for (let i = 0; i < 11; i++) {
            let num = parseInt(cedula[i]) * weights[i];
            sum += num > 9 ? num - 9 : num;
        }

        return sum % 10 === 0;
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isValidCedula(formData.cedula)) {
            alert('Cédula no válida.');
            return;
        }

        if (formData.limite_credito < 0) {
            alert('El límite de crédito no puede ser negativo.');
            return;
        }

        if (clienteId) {
            axios.put(`http://localhost:3001/api/clientes/${clienteId}`, formData)
                .then(response => {
                    alert('Cliente actualizado');
                    fetchClientes();
                    setFormData({
                        nombre: '',
                        cedula: '',
                        limite_credito: 0,
                        estado: 'Activo'
                    });
                    setClienteId(null);
                })
                .catch(error => {
                    console.error("Error al actualizar el cliente:", error);
                });
        } else {
            axios.post('http://localhost:3001/api/clientes', formData)
                .then(response => {
                    alert('Cliente creado');
                    agregarCliente(response.data);
                    setFormData({
                        nombre: '',
                        cedula: '',
                        limite_credito: 0,
                        estado: 'Activo'
                    });
                    fetchClientes();
                })
                .catch(error => {
                    console.error("Error al crear el cliente:", error);
                });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{clienteId ? 'Actualizar Cliente' : 'Registrar Nuevo Cliente'}</h2>
            <div>
                <label>Nombre</label>
                <input type='text' name="nombre" value={formData.nombre} onChange={handleInputChange} required />
            </div>
            <div>
                <label>Cédula</label>
                <input type="text" name="cedula" value={formData.cedula} onChange={handleInputChange} required />
            </div>
            <div>
                <label>Límite de Crédito</label>
                <input
                    type="number"
                    name="limite_credito"
                    value={formData.limite_credito}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label>Estado</label>
                <select name="estado" value={formData.estado} onChange={handleInputChange} required>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                </select>
            </div>
            <button type="submit">{clienteId ? 'Actualizar' : 'Crear'}</button>
        </form>
    );
};

export default FormularioCliente;
