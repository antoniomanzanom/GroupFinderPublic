import React, { useState,useEffect } from 'react'
import "./LoginRegister.css"
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom'

const LoginRegister = (props) => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [battletag, setBattletag] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [roletype, setRoletype] = useState("user")
    const [usernameLogin, setUsernameLogin] = useState("")
    const [passwordLogin, setPasswordLogin] = useState("")
    const [errorRegister, setErrorRegister] = useState(null)
    const [errorLogin, setErrorLogin] = useState(null)
    let history = useHistory();

    useEffect(() => {
        props.setPage("login-register")
    }, [])

    const userRegister= async(e)=>{
        e.preventDefault();
        console.log(username,email,battletag,password,password2)
        if(!username.trim() || !email.trim() || !battletag.trim() || !password.trim() || !password2.trim()){
            setErrorRegister("No dejes ningún campo vacío")
            return;
        }else{
            setErrorRegister(null)
        }

        if(password2!==password){
            setErrorRegister("Ambas contraseñas deben coincidir")
            return;
        }

        const res = await fetch("http://127.0.0.1:5000/user/register",{
            method:"POST",
            headers: {
                "Content-type": "application/json",
              },
            body: JSON.stringify({
                username: username,
                email: email,
                battletag:battletag,
                password:password,
                role_type:roletype
              }),
        })
        console.log(await res.json())
        if(res.status===201){
            history.push("/verification");
        }else{
            setErrorRegister("Usuario o correo electrónico ya ocupados")
        }
    }
    const userLogin = async(e)=>{
        if(!usernameLogin.trim() || !passwordLogin.trim()){
            setErrorLogin("No deje los campos vacíos")
        }
        e.preventDefault();
        const res = await fetch("http://127.0.0.1:5000/user/login",{
            method:"POST",
            headers: {
                "Content-type": "application/json",
              },
            body: JSON.stringify({
                username: usernameLogin,
                password:passwordLogin,
              }),
        })
        const data = await res.json()
        if(res.status===200){
            
            localStorage.setItem('user_id',data.user.id)
            localStorage.setItem('access_token',data.access_token)
            localStorage.setItem('group_id',data.user.group_id)
            localStorage.setItem('liderDeGrupo',data.user.liderDeGrupo)
            props.setLoggedIn(true)
            history.push("/characters");
        }else{
            setErrorLogin("Datos incorrectos, recuerda también verificar tu cuenta")
        }
    }

    return (
        <>
            
            <main className="body__main">
                <div className="main__div--perfil">
                <div className="contenedores_login">
                    <div className="main__contenedor_izquierda_login">
                        <h2>Inicio de sesión</h2>
                        <div className="forms">
                            <div className="div__forms">
                                <label htmlFor="username" className="logintext1">Nombre de usuario</label>
                                <input type="text" id="usernameLogin" className="form__inputtext_login1" onChange={(e) => setUsernameLogin(e.target.value)} value={usernameLogin}></input>
                            </div>
                            <div className="div__forms">
                                <label htmlFor="password" className="logintext">Contraseña</label>
                                <input type="password" id="passwordLogin" className="form__inputtext_login" onChange={(e) => setPasswordLogin(e.target.value)} value={passwordLogin}></input>
                            </div> 
                        </div>
                        {errorLogin === null ? null:    
                                <p className="errorRegister">{errorLogin}</p>
                        }
                        <input type="button" value="Iniciar Sesión" className="boton_login" onClick={userLogin}></input>
                            <p>¿Aún no has verificado tu cuenta?</p>
                            <Link to="/verification" className="link__verification">Click Aquí</Link>

                        

                    </div>
                        
                    <div className="main__contenedor_derecha_login">
                    <h2>Registro</h2>
                        <form className="forms">
                            <div className="div__forms">
                                <label htmlFor="username" className="logintext">Nombre de usuario</label>
                                <input type="text" id="username" className="form__inputtext_login" onChange={(e) => setUsername(e.target.value)} value={username}></input>
                            </div>
                            <div className="div__forms">
                                <label htmlFor="password" className="logintext">Contraseña</label>
                                <input type="password" id="password" className="form__inputtext_login" onChange={(e) => setPassword(e.target.value)} value={password}></input>
                            </div>
                            <div className="div__forms">
                                <label htmlFor="password2" className="logintext">Repite Contraseña</label>
                                <input type="password" id="password2" className="form__inputtext_login" onChange={(e) => setPassword2(e.target.value)} value={password2}></input>
                            </div>
                            <div className="div__forms">
                                <label htmlFor="email" className="logintext">Correo electrónico</label>
                                <input type="email" id="email" className="form__inputtext_login" onChange={(e) => setEmail(e.target.value)} value={email}></input>
                            </div>
                            <div className="div__forms">
                                <label htmlFor="battletag" className="logintext">Battletag</label>
                                <input type="text" id="battletag" className="form__inputtext_login" onChange={(e) => setBattletag(e.target.value)} value={battletag}></input>
                            </div>

                            
                        </form>
                        {errorRegister === null ? null:    
                                <p className="errorRegister">{errorRegister}</p>
                        }
                        <input type="button" value="Registrate" className="boton_login" onClick={userRegister}></input>
                        <p>Términos de uso</p>

                    </div>
                </div>
                
                </div>
            </main>
            </>
        
    )
}

export default LoginRegister
