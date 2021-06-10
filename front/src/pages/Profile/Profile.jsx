import React from 'react'
import "./Profile.css"
import { useState,useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from "react-router-dom";

const Profile = (props) => {
    var user_id = window.localStorage.getItem('user_id')
    var token = window.localStorage.getItem('access_token')
    const [user, setUser] = useState("")
    const [characterList, setCharacterList] = useState([])
    const [editing, setEditing] = useState(false)
    const [battletag,setBattletag] = useState("")
    const [numero,setNumero] = useState(0)
    const [error,setError] = useState("")
    let history = useHistory();

    useEffect(() => {
        props.setPage("perfil")
        UserLoad()
        cargarPersonajes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numero])
    
    const UserLoad =async ()=>{
        const res = await fetch("http://127.0.0.1:5000/user/"+user_id,{
            method:"GET",
            headers: {
                "Content-type": "application/json",
                "Authorization":token
              }
        })
        const data= await res.json()
        setUser(data)
    }
    const cargarPersonajes = async ()=>{
        const res = await fetch("http://127.0.0.1:5000/characters/"+user_id,{
                method:"GET",
                headers: {
                    "Content-type": "application/json",
                  }
            })
            const data = await res.json();
            setCharacterList(data.characters)
    }

    const cambioDeBattletag = async (e)=>{
        if(!battletag.trim()){
            setError("No dejes el campo vacío")
        }
        e.preventDefault();
        const res = await fetch("http://127.0.0.1:5000/user/battletag/"+user_id,{
                method:"PUT",
                headers: {
                    "Content-type": "application/json",
                  },
                body: JSON.stringify({
                    "battletag":battletag
                })

            })
            if (res.status === 200){
                setEditing(!editing)
                setNumero(numero+1)
                setError("")
            }else{
                setError("Algo ha fallado, intentelo de nuevo")
            }
        
    }
    const logout =async ()=>{
        const res = await fetch("http://127.0.0.1:5000/user/logout",{
                method:"POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": token
                  },
            })
        if(res.status===200){
            localStorage.clear()
            props.setLoggedIn(false)
            history.push("/");
        }
    }
    return (
        <main className="body__main__perfil">
        <div className="main__div__perfil">

            <div className="perfil">
            
            {user ==="" ? null: 
                <>
                    
                    <div className="div_infouser">
                    <h1 className="h1_perfil">Perfil del usuario</h1>
                        {characterList.length===0 ?
                            <img src="./img/default.jpg" className="profile_pic" alt="imagen de usuario"></img>
                            
                            :
                            
                            <img src={characterList[0].img_url} className="profile_pic" alt="imagen de usuario"></img>


                        }
                        <p className="perfil__texto__username">{user.username}</p>
                    
                        <div className="battletag_div">{editing ?<><p className="perfil__texto__Battletag">Battletag:</p><input type="text" onChange={(e) => setBattletag(e.target.value)} value={battletag}/><button className="boton__guardar__cambios" onClick={cambioDeBattletag}>Guardar</button></>:<><p className="perfil__texto">Battletag: {user.battletag}</p> <button className="editbutton" onClick={()=>{setEditing(!editing)}}><FontAwesomeIcon icon={faPen}/></button></>}</div>
                        {error ===""?null:<p className="errorRegister">{error}</p>}
                        <p className="perfil__texto"> Correo Electrónico: {user.email}</p>
                        <button className="logout_button" onClick={logout}> Cerrar Sesión</button>
                    </div>
                    <div className="div_img_gnomo">
                        <img src="./img/perfil4.jpg" alt="" />
                    </div>
                </>
                
            
            } 
            


            
            </div>
        </div>
        </main>
    )
}

export default Profile
