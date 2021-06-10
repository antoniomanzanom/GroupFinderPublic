import React,{ useEffect }  from 'react'
import "./home.css"
import { Link } from 'react-router-dom'

const Home = (props) => {

    const lightmode=()=>{

    }
    useEffect(() => {
        props.setPage("Inicio")
    }, [])
    
    return (
    <>
        <main className="body__main" id="main">
        <div className="main__div" id="maindiv">
            <figure className="maindiv__figure">
                <img src="./img/shadowlands2.jpg" alt="Imagen de Shadowlands"></img>
                <figcaption></figcaption>
            </figure>
            
            

            
            <div className="main__container">
                <div className="div__textoHome">
                <h1 className="maindiv__h1">¡Bienvenido a GroupFinder.io!</h1>
                    <p className="maindiv__parrafo">
        
                        El objetivo de GroupFinder es crear un punto de encuentro para los jugadores del juego World of Warcraft. Con nuestra herramienta para la creación y búsqueda de grupos podrás encontrar gente para jugar que cumplan tus requisitos en cuestión de minutos. ¡No esperes más y ponte manos a la obra!
                    </p>
                    <Link to="/login-register" className="boton">¡Comienza tu aventura!</Link>
                </div>
                <div className="div__imagenHome">
                    <figure className="imagenHome">
                        <img src="./img/home8.png" alt="Imagen de Shadowlands"></img>
                        <figcaption></figcaption>
                    </figure>
                </div>
                
            </div>
            
        </div>
        </main>
        <script src="https://kit.fontawesome.com/be6ef001a7.js" crossOrigin="anonymous"></script>
        </>
    )
}

export default Home
