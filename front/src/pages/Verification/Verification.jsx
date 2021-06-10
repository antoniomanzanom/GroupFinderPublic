import React,{useState} from 'react'
import { useHistory } from "react-router-dom";

import "./Verification.css"
const Verification = (props) => {
    const [codigo, setCodigo] = useState()
    let history = useHistory();

    const verificate = async () => {
        const res = await fetch("http://127.0.0.1:5000/user/activate/"+codigo,{
            method:"POST",
            headers: {
                "Content-type": "application/json",
              }
        })
        if(res.status===200){
            history.push("/login-register")
        }
    }

    return (
        <main className="body__main">
            <div className="main__div--perfil">
                <figure className="maindiv__figure">
                    <img src="./img/error.jpg" alt="Imagen de Shadowlands" className="img_error"></img>
                    <figcaption></figcaption>
                </figure>
                    <p className="p__nologin">Introduce el código que se ha enviado a tu email para verificar tu cuenta.</p>
                    <input type="text" onChange={(e) => setCodigo(e.target.value)} value={codigo} className="input__verification"/>
                    <button className="boton__verification" onClick={verificate}>Verificar</button>
            </div>
        </main>
    )
}

export default Verification
