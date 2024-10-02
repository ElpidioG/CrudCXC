import { Link } from 'react-router-dom';
import '../Styles/NavBar.css';

function NavBar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="logo">
                    <Link style={{ textDecoration: 'none' }} to="/landing">
                        <h1>Cuentas x Cobrar</h1>
                    </Link> 
                </div>
                <ul className="nav-links">
                    <li><Link to="/balances">Balances</Link></li>
                    <li><Link to="/asientos-contables">Asientos Contables</Link></li>
                    <li><Link to="/clientes">Clientes</Link></li>
                    <li><Link to="/transacciones">Transacciones</Link></li>
                    <li><Link to="/tipo-de-documento">Tipo de documento</Link></li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;
