import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/FormStyle.css';
import { AuthContext } from '../Contexts/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/login', {
                username,
                password,
            });

            const token = response.data.token;
            login(token); 
            alert('Inicio de sesión exitoso.');
            navigate('/');
        } catch (error) {
            alert('Error al iniciar sesión: ' + (error.response?.data || error.message));
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Iniciar Sesión</h2>
            <input
                type="text"
                placeholder="Credencial de acceso"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Iniciar Sesión</button>
            
            {/* Botón de registro */}
            <div className="register-link">
                <p>¿No tienes cuenta?</p>
                <Link to="/Registro">
                    <button type="button">Registrarse</button>
                </Link>
            </div>
        </form>
    );
};

export default Login;
