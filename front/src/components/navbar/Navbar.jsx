import React,{useEffect} from 'react'
import { Link } from 'react-router-dom'
import "./navbar.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars,faEllipsisV } from '@fortawesome/free-solid-svg-icons'

const Navbar = (props) => {

    
    const handleResize = () => {
        if (window.innerWidth > 854) {
            document.getElementById("myLinks").style.display="none";
            document.getElementById("myLinks").style.width= "0";
        }
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize)
    })

    var x = document.getElementById("myLinks")
    var y = document.getElementById("headernav")
    const menu = () => {

        if (x.style.display === "block") {
            x.style.display = "none";
            props.setFooterOptions(true)
            y.style.zIndex=0
            
        } else {
            y.style.zIndex=1
            x.style.marginRight="20px";
            x.style.display="block";
            x.style.width= "100%";
            props.setFooterOptions(false)
            
        }
          
    }

    return (
        <header className="body__header" id="header">
            <div className="header__div--logo" id="headerlogo">
                
                <Link to="/" className="header__link"><img src="./img/logo.png" alt="" className="link__image"></img></Link>
                <p className="header__parrafo">GroupFinder.io</p>
                
                <Link className="icon" onClick={menu}>                   
                        <span  className="fa fa-bars hamburguesa"><FontAwesomeIcon icon={faEllipsisV}></FontAwesomeIcon>{/*Menú*/}</span>                 
                </Link>
            </div>
            <nav className="header__nav" id="headernav">
                <ul className="lista__nav">
                    <li className="listanav__item" id="listanavitem"><Link to="/" className={props.page==="Inicio" ? "item__link amarillo":"item__link"}>Inicio</Link></li>
                    <li className="listanav__item" id="listanavitem"><Link to="/characters"  className={props.page==="Personajes" ? "item__link amarillo":"item__link"}>Personajes</Link></li>
                    <li className="listanav__item" id="listanavitem"><Link to="/groupcreation" className={props.page==="Groupcreation" ? "item__link amarillo":"item__link"}>Tu grupo</Link></li>
                    <li className="listanav__item" id="listanavitem"><Link to="/groupfinder" className={props.page==="Groupfinder" ? "item__link amarillo":"item__link"}>Buscar grupo</Link></li>
                    
                    {
                        props.loggedIn ?  
                        <li className="listanav__item" id="listanavitem"><Link to="/profile" className={props.page==="perfil" ? "item__link amarillo":"item__link"}>Perfil</Link></li>
                        :
                        <li className="listanav__item" id="listanavitem"><Link to="/login-register" className={props.page==="login-register" ? "item__link amarillo":"item__link"}>Login/ Register</Link></li>
                    }
                    
                    
                    
                </ul>
                
                <div id="myLinks">
                        <li className="oculto" onClick={menu}><Link to="/" className={props.page==="Inicio" ? "item__link amarillo":"item__link"}>Inicio</Link></li>
                        <li className="oculto" onClick={menu}><Link to="/characters"  className={props.page==="Personajes" ? "item__link amarillo":"item__link"}>Personajes</Link></li>
                        <li className="oculto" onClick={menu}><Link to="/groupcreation" className={props.page==="Groupcreation" ? "item__link amarillo":"item__link"}>Tu grupo</Link></li>
                        <li className="oculto" onClick={menu}><Link to="/groupfinder" className={props.page==="Groupfinder" ? "item__link amarillo":"item__link"}>Buscar grupo</Link></li>
                        
                        {
                            props.loggedIn ?  
                            <li className="oculto" onClick={menu}><Link to="/profile" className={props.page==="perfil" ? "item__link amarillo":"item__link"}>Perfil</Link></li>
                            :
                            <li className="oculto" onClick={menu}><Link to="/login-register" className={props.page==="login-register" ? "item__link amarillo":"item__link"}>Login/ Register</Link></li>
                        }
                </div>
                
            </nav>  
            
        </header>
    )
}

export default Navbar
