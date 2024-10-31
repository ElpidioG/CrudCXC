import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');

    // Función de validación de cédula usando algoritmo local
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

    const handleRegister = async (e) => {
        e.preventDefault();

        if (role === 'user') {
            if (!isValidCedula(username)) {
                setError('Cédula no válida.');
                return;
            }
        }

        try {
            await axios.post('http://localhost:3001/api/register', {
                username,
                password,
                role,
            });
            alert('Registro exitoso.');
        } catch (error) {
            alert('Error al registrar: ' + (error.response?.data.message || error.message));
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <h2>Registro de Usuario</h2>

            {/* Selección de rol */}
            <select onChange={(e) => setRole(e.target.value)} value={role}>
                <option value="user">Cliente</option>
                <option value="admin">Administrador</option>
            </select>

            {/* Campo de Cédula o Correo Electrónico según el rol */}
            {role === 'user' ? (
                <input
                    type="text"
                    placeholder="Cédula"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        setError('');
                    }}
                    required
                />
            ) : (
                <input
                    type="email"
                    placeholder="Correo Electrónico"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        setError('');
                    }}
                    required
                />
            )}

            {/* Mostrar error si la cédula no es válida */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Contraseña */}
            <input
                type="password"
                placeholder="Contraseña"
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button type="submit">Registrar</button>
        </form>
    );
};

export default Register;
