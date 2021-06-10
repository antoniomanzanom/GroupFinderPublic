import React, { useState,useEffect } from 'react'
import "./personajes.css"
import { Link } from 'react-router-dom'
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";

const Personajes = (props) => {
    const [personajes, setPersonajes] = useState([])
    const [numero, setNumero] = useState(0)
    const [name, setName] = useState("")
    const [realm,setRealm] = useState("")
    const [error, setError] = useState("")
    let history = useHistory();

    var access_token= window.localStorage.getItem('access_token')
    var user_id = window.localStorage.getItem('user_id')

    useEffect(() => {
        props.setPage("Personajes")
        const cargarpersonajes= async()=>{
            const res = await fetch("http://127.0.0.1:5000/characters/"+user_id,{
                method:"GET",
                headers: {
                    "Content-type": "application/json",
                  }
            })
            const data = await res.json();
            console.log(data)
            setPersonajes(data.characters)
        }
        cargarpersonajes()

    }, [numero])


    const anadirPersonaje= async(e)=>{
        e.preventDefault();
        const res = await fetch("http://127.0.0.1:5000/character/register/"+user_id,{
            method:"POST",
            headers: {
                "Content-type": "application/json",
              },
            body: JSON.stringify({
                name: name,
                realm: realm,
              }),
        })
        const data = await res.json();
        if (res.status === 200){

            setPersonajes([...personajes,data])
            setNumero(numero+1)
            setError("")

        }else{
            setError(data.message)
        }
    }

    return (

        user_id === null ? /*<Redirect to="/login-register"/>*/
            <main className="body__main">
            <div className="main__div--perfil">
            <figure className="maindiv__figure">
                <img src="./img/error.jpg" alt="Imagen de Shadowlands" className="img_error"></img>
                <figcaption></figcaption>
            </figure>
                <p className="p__nologin">Para acceder a la página de personajes, tienes que iniciar sesión.</p>
                <Link to="/login-register" className="boton__nologin">Inicia Sesión</Link>
            </div>
            </main>
            :
            <>
                <main className="body__main">
                <div className="main__div--perfil">
                    <div id="myLinks" className="links__ocultos">
                        <li className="oculto"><Link to="/" className="item__link">Group Finder</Link></li>
                        <li className="oculto"><Link to="/" className="item__link">Noticias</Link></li>
                        <li className="oculto"><Link to="/" className="item__link">Guías</Link></li>
                        <li className="oculto"><Link to="/" className="item__link">Soporte</Link></li>
                        <li className="oculto"><Link to="/" className="item__link">Login/ Register</Link></li>
                    </div>
                    <h1 className="h1__characters">Bienvenido a tu menú de personajes</h1>
                    <div className="tarjetas__personajes_guardar">
                            <form action="" className="form__charcreation">
                                <h3>¡Añade tu personaje!</h3>
                                <div>
                                    <label htmlFor="nombre" className="charcreation_label">Nombre del personaje</label>
                                    <input type="text" id="nombre" className="clases_input_anadir" onChange={(e) => setName(e.target.value)} value={name}></input>
                                </div>

                                <div>
                                    <label htmlFor="reino" className="charcreation_label">Reino del personaje</label>
                                    <input type="text" id="reino" className="clases_input_anadir" onChange={(e) => setRealm(e.target.value)}  value={realm}></input>
                                </div>
                                <button className="boton__guardar__personaje" onClick={anadirPersonaje}>Añadir</button>

                                <p className="charcreation__error">{error}</p>
                            </form>
                    </div>
                    <hr/>
                    <div className="main__contenedortarjetas">
                        
                        {personajes.length===0 ? null: personajes.map((personaje)=>
                            
                            <div className="tarjetas__personajes_guardados" key={personaje.name}>
                                <div className="form__clases_guardados" >
                                    <img src={personaje.img_url} className="clases_form_guardados_img" alt=""/>

                                    <label htmlFor="nombre" className="clases_form_guardados">Nombre y reino del personaje</label>
                                    <p id="nombre" className={personaje.clase}>{personaje.name+"-"}{personaje.realm}</p>
                                    
                                    <label htmlFor="raiderio" className="clases_form_guardados">Raider.io del personaje</label>
                                    <p id="raiderio" >{personaje.elo}</p>
                                    
                                    <label htmlFor="clase" className="clases_form_guardados">Clase y especialización</label>
                                    <p className={personaje.clase}>{personaje.spec+" "}{personaje.clase}</p>
                                    
                                    <label htmlFor="link" className="clases_form_guardados">Link al Perfil</label>
                                    <a href={personaje.profile_url} id="link">Click Aquí</a>
                                </div>
                            </div>
                        
                        )} 
                    </div>
                </div>
                </main>
                <script src="https://kit.fontawesome.com/be6ef001a7.js" crossOrigin="anonymous"></script>
        </>


        
    )
}

export default Personajes
