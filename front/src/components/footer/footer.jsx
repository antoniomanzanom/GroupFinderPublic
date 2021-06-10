import React from 'react'
import { Link } from 'react-router-dom'

const footer = () => {
    return (
        <footer className="body__footer" id="footer">
        <div className="footer__div--principal" id="footer_principal">
            <div className="footer__div">
                <ul className="footerdiv_lista">
                    <li><Link to="/" className="listafooter__link--cabecera">Nuestra Historia</Link></li>
                    <li><Link to="/" className="listafooter__link">Historia</Link></li>
                    <li><Link to="/" className="listafooter__link">Equipo</Link></li>
                    <li><Link to="/" className="listafooter__link">Infraestructura</Link></li>
                    <li><Link to="/" className="listafooter__link">Trabaja con nosotros</Link></li>
                </ul>
            </div>
            <div className="footer__div">
                <ul className="footerdiv_lista">
                    <li><Link to="/" className="listafooter__link--cabecera">Servicios</Link></li>
                    <li><Link to="/" className="listafooter__link">Buscador de grupos</Link></li>
                    <li><Link to="/" className="listafooter__link">Noticias</Link></li>
                    <li><Link to="/" className="listafooter__link">Guías</Link></li>
                    <li><Link to="/" className="listafooter__link">Termino y condiciones</Link></li>
                </ul>
            </div>
            <div className="footer__div">
                <ul className="footerdiv_lista">
                    <li><Link to="/" className="listafooter__link--cabecera">Soporte</Link></li>
                    <li><Link to="/" className="listafooter__link">Consigue ayuda</Link></li>
                    <li><Link to="/" className="listafooter__link">Contáctanos</Link></li>
                    <li><Link to="/" className="listafooter__link">FAQ</Link></li>
                    <li><Link to="/" className="listafooter__link">Escribe tu guía</Link></li>
                </ul> 
            </div>
        </div>
        </footer>
    )
}

export default footer
