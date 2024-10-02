import React from 'react';
import '../Styles/Landing.css';
import Header from './header';
import Footer from './footer';

const Landing = () => {
    return (
        <div>
            <Header />
            <section id="features" className="features">
                <h2>Características Clave</h2>
                <br></br><br></br>
                <div className="feature-list">
                    <div className="feature">
                        <h3>Seguimiento de Clientes</h3>
                        <p>Maneja todos tus clientes y las cuentas por cobrar.</p>
                    </div>
                    <div className="feature">
                        <h3>Registra y consulta</h3>
                        <p>Registra y consulta cada cliente, transacción, balance, etc.</p>
                    </div>
                    <div className="feature">
                        <h3>Informes Detallados</h3>
                        <p>Genera informes sobre los clientes y flujo de caja.</p>
                    </div>
                </div>
            </section>

            <section className="testimonials">
                <h2>Lo Que Dicen Nuestros Usuarios</h2>
                <div className="testimonial-list">
                    <div className="testimonial">
                        <p>"Este sistema ha transformado nuestra manera de gestionar cuentas por cobrar. ¡Altamente recomendado!"</p>
                        <h4>- Juan Pérez</h4>
                    </div>
                    <div className="testimonial">
                        <p>"Los informes automáticos me han ayudado a no olvidar ningún pago."</p>
                        <h4>- María López</h4>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Landing;
