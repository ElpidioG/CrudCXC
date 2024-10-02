
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/FormStyle.css'; // Estilos

const FormularioTipoDocumento = ({ tipoDocumentoId, agregarTipoDocumento, fetchTipoDocumento, setTipoDocumentoId }) => {
    const [formData, setFormData] = useState({
        descripcion: '',
        cuenta_contable: '',
        estado: 'Activo'
    });

    useEffect(() => {
        if (tipoDocumentoId) {

            axios.get(`http://localhost:3001/api/tipos_documentos/${tipoDocumentoId}`)
                .then(response => {
                    const tipoDocumentoData = response.data;
                    setFormData({
                        descripcion: tipoDocumentoData.descripcion,
                        cuenta_contable: tipoDocumentoData.cuenta_contable,
                        estado: tipoDocumentoData.estado
                    });
                })
                .catch(error => {
                    console.error("Error al obtener tipo de documento:", error);
                    alert("Error al obtener tipo de documento");
                });
        } else {
            // Si no hay tipoDocumentoId, reiniciar el formulario
            setFormData({
                descripcion: '',
                cuenta_contable: '',
                estado: 'Activo'
            });
        }
    }, [tipoDocumentoId]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (tipoDocumentoId) {
            // Update tipo de documento existente
            axios.put(`http://localhost:3001/api/tipos_documentos/${tipoDocumentoId}`, formData)
                .then(response => {
                    alert('Tipo de documento actualizado');
                    fetchTipoDocumento(); // Refresca la lista después de actualizar
                    setFormData({ // Reinicia el formulario
                        descripcion: '',
                        cuenta_contable: '',
                        estado: 'Activo'
                    });
                    setTipoDocumentoId(null); // Restablecer tipoDocumentoId después de actualizar
                })
                .catch(error => {
                    console.error("Error al actualizar el tipo de documento:", error);
                });
        } else {
            // Crear nuevo Tipo de documento 
            axios.post('http://localhost:3001/api/tipos_documentos', formData)
                .then(response => {
                    alert('Tipo de documento creado');
                    agregarTipoDocumento(response.data); // Agregar el nuevo Tipo de documento  a la lista
                    setFormData({ // Reinicia el formulario
                        descripcion: '',
                        cuenta_contable: '',
                        estado: 'Activo'
                    });
                    fetchTipoDocumento(); // Refresca la lista
                })
                .catch(error => {
                    console.error("Error al crear el Tipo de documento:", error);
                });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{tipoDocumentoId ? 'Actualizar tipo de documento' : 'Registrar Nuevo tipo de documento'}</h2>
            <div>
                <label>Descripción</label>
                <input type="text" name="descripcion" value={formData.descripcion} onChange={handleInputChange} />
            </div>
            <div>
                <label>Cuenta Contable</label>
                <input type="text" name="cuenta_contable" value={formData.cuenta_contable} onChange={handleInputChange} />
            </div>
            <div>
                <label>Estado</label>
                <select name="estado" value={formData.estado} onChange={handleInputChange}>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                </select>
            </div>
            <button type="submit">{tipoDocumentoId ? 'Actualizar' : 'Crear'}</button>
        </form>


    );
}

export default FormularioTipoDocumento;
