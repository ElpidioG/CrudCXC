import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './Components/Layout/Navbar'; // Importa tu NavBar
import ListaBalances from './Components/Listas/ListaBalances';

import ListaAsientosContables from './Components/Listas/ListaAsientosContables';
import ListaTransacciones from './Components/Listas/ListaTransacciones';
import ListaClientes from './Components/Listas/ListaClientes';
import ListaTiposdedocumentos from './Components/Listas/listatipodedocumentos';
import Landing from './Components/Layout/landing';

function App() {
    return (
        <div>
            <Router>
                <NavBar /> 
                <Routes>
                <Route path="/" element={<Landing></Landing>} />
                 
                    <Route path="/landing" element={<Landing></Landing>} />

               
                    <Route path="/balances" element={<ListaBalances />} />

            
                    <Route path="/asientos-contables" element={<ListaAsientosContables />} />

                    

                    <Route path="/clientes" element={<ListaClientes />} />

                    <Route path="/tipo-de-documento" element={<ListaTiposdedocumentos />} />

                    <Route path="/transacciones" element={<ListaTransacciones />} />


                 
                </Routes>
            </Router>
        </div>
    );
}

export default App;
