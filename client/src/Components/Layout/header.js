import React from 'react';
import '../Styles/Landing.css';

const Header = () => {
    return (
        <header className="header">
            <h1>Gestión de Cuentas por Cobrar</h1>
            <p>Optimiza tu flujo de caja y gestiona tus cuentas por cobrar de manera eficiente.</p>
            <a href="#features" className="cta-button">Descubre Más</a>
        </header>
    );
};

export default Header;
