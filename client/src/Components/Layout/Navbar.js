import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/NavBar.css';
import { AuthContext } from '../Contexts/AuthContext';

function NavBar() {
    const { isAuthenticated, role, logout } = useContext(AuthContext);
    const [isFirstVisit, setIsFirstVisit] = useState(true);

    useEffect(() => {
        // Verifica si ya hay una sesión iniciada
        if (isAuthenticated) {
            setIsFirstVisit(false); // Si ya hay sesión, no es la primera visita
        }
    }, [isAuthenticated]);

    // Función para manejar el logout con confirmación
    const handleLogout = (e) => {
        e.preventDefault(); // Prevenir la navegación automática al hacer clic
        const isConfirmed = window.confirm("¿Estás seguro de que deseas cerrar sesión?");
        if (isConfirmed) {
            logout(); // Llama a la función de logout si el usuario confirma
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="logo">
                    <Link style={{ textDecoration: 'none' }} to="/landing">
                        <h1>Cuentas x Cobrar</h1>
                    </Link>
                </div>
                <ul className="nav-links">
                    {isAuthenticated ? (
                        <>
                            {role === 'admin' && (
                                <>
                                    <li><Link to="/balances">Balances</Link></li>
                                    <li><Link to="/asientos-contables">Asientos Contables</Link></li>
                                    <li><Link to="/clientes">Clientes</Link></li>
                                    <li><Link to="/transacciones">Transacciones</Link></li>
                                    <li><Link to="/tipo-de-documento">Tipo de documento</Link></li>
                                </>
                            )}
                            {role === 'user' && (
                                <>
                                    <li><Link to="/balances">Balances</Link></li>
                                    <li><Link to="/asientos-contables">Asientos Contables</Link></li>
                                    <li><Link to="/transacciones">Transacciones</Link></li>
                                </>
                            )}
                            <li>
                                <Link to="/landing" onClick={handleLogout}>Logout</Link>
                            </li>
                        </>
                    ) : (
                        // Solo muestra "Login" si es la primera visita
                        isFirstVisit && <li><Link to="/login">Login</Link></li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;
