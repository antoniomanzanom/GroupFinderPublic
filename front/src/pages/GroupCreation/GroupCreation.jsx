import React from 'react'
import "./groupCreation.css"
import { useState,useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes,faSync } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useHistory } from "react-router-dom";


const GroupCreation = (props) => {
    
    const [name, setName] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [dificultad, setDificultad] = useState("0")
    const [mazmorra, setMazmorra] = useState("Bajapeste")
    const [character_name, setCharacter_name] = useState("")

    const [characterList,setCharacterList] = useState([])
    const [characterListGroup,setCharacterListGroup] = useState([])
    const [characterListCola,setCharacterListCola] = useState([])
    const [tamano,setTamano] = useState("main__contenedor_izquierda")
    const [numero,setNumero] = useState(1)

    var user_id = window.localStorage.getItem('user_id')
    var group_id = window.localStorage.getItem('group_id')
    var liderDeGrupo = window.localStorage.getItem('liderDeGrupo')
    let history = useHistory();
    
    useEffect(() => {
        props.setPage("Groupcreation")
        cargarPersonajes()
        if(group_id!=="null"){
            cargarPersonajesGrupo()
            cargarInfoGrupo()
            cargarPersonajesCola()
            setTamano("main__contenedor_izquierda")
            
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[numero])
    
    const cargarPersonajes= async () => {
        const res = await fetch("http://127.0.0.1:5000/characters/"+user_id,{
                method:"GET",
                headers: {
                    "Content-type": "application/json",
                  }
            })
            const data = await res.json();
            console.log("data: "+data)
            setCharacterList(data.characters)
            if (data.characters.length>0){
                setCharacter_name(data.characters[0].name)
            }
        }

    const cargarInfoGrupo= async () => {
        const res = await fetch("http://127.0.0.1:5000/group/"+group_id,{
                method:"GET",
                headers: {
                    "Content-type": "application/json",
                  }
            })
            const data = await res.json();
            setName(data.name)
            setMazmorra(data.mazmorra)
            setDificultad(data.dificultad)
            setDescripcion(data.descripcion)
    }
    const cargarPersonajesGrupo = async () =>{
        const res = await fetch("http://127.0.0.1:5000/characters/group/"+group_id,{
                method:"GET",
                headers: {
                    "Content-type": "application/json",
                  }
            })
            const data = await res.json();
            if(data.characters.length===0){
                localStorage.setItem('liderDeGrupo',false)
                localStorage.setItem('group_id','null')
                setNumero(numero+1)
                history.push("/groupfinder")
            }
            setCharacterListGroup(data.characters)
    }
    const cargarPersonajesCola = async () =>{
        const res = await fetch("http://127.0.0.1:5000/characters/queue/"+group_id,{
                method:"GET",
                headers: {
                    "Content-type": "application/json",
                  }
            })
            const data = await res.json();
            setCharacterListCola(data.characters)
    }

    const crearGrupo= async(e) => {
        e.preventDefault()
        const res = await fetch("http://127.0.0.1:5000/group/creation/"+user_id,{
            method:"POST",
            headers: {
                "Content-type": "application/json",
              },
            body: JSON.stringify({
                name: name,
                descripcion: descripcion,
                dificultad:dificultad,
                mazmorra:mazmorra,
                character_name:character_name,
              }),
        })

        const data = await res.json()

        if(res.status===200){
            console.log(data.group_id)
            localStorage.setItem('group_id',data.group_id)
            localStorage.setItem('liderDeGrupo',true)
            group_id=data.group_id
            setNumero(numero+1)

        }
    }
    const invitarPersona= async (invite_id) => {
        const res = await fetch("http://127.0.0.1:5000/group/user/"+invite_id,{
            method:"POST",
            headers: {
                "Content-type": "application/json",
              }
        })
        if(res.status===200){
            setNumero(numero+1)
        }

    }
    const echarPersona = async (delete_id) => {

        if(delete_id == user_id){
            
            abandonarGrupo()
            return
        }
        
        const res = await fetch("http://127.0.0.1:5000/group/user/"+delete_id,{
            method:"DELETE",
            headers: {
                "Content-type": "application/json",
              }
        })
        if(res.status===200){
            setNumero(numero+1)
        }

    }
    const abandonarGrupo = async () =>{
        console.log("group_id: "+group_id)
        const res = await fetch("http://127.0.0.1:5000/group/" + group_id,{
            method:"DELETE",
            headers: {
                "Content-type": "application/json",
              }
        })
        
        if(res.status===200){
            localStorage.setItem('liderDeGrupo',false)
            localStorage.setItem('group_id','null')
            setNumero(numero+1)
            history.push("/groupfinder")
        }
    }
    const abandonarGrupoNoLider = async () =>{
        const res = await fetch("http://127.0.0.1:5000/group/user/"+user_id,{
            method:"DELETE",
            headers: {
                "Content-type": "application/json",
              }
        })
        if(res.status===200){
            localStorage.setItem('liderDeGrupo','DENNIED')
            localStorage.setItem('group_id','null')
            setNumero(numero+1)
            history.push("/groupfinder")
        }
    }

    return (

        user_id === null ? 
            <main className="body__main">
            <div className="main__div--perfil">
                <figure className="maindiv__figure">
                    <img src="./img/error.jpg" alt="Imagen de Shadowlands" className="img_error"></img>
                    <figcaption></figcaption>
                </figure>
                    <p className="p__nologin">Para acceder a la página de tu grupo, tienes que iniciar sesión.</p>
                    <Link to="/login-register" className="boton__nologin">Inicia Sesión</Link>
            </div>
            </main>
        :
        <>
        
            <main className="body__main" id="main">
            <div className="groupCreation__main__div">
                
                <h1 className="h1_groupcreation">¡Bienvenido al creador de grupo!</h1>
                <div className="contenedores">
                    <div className={tamano} id="contenedorIzquierda">
                        
                        
                        {
                            group_id!=="null" ? 

                            <>
                            <div className="infogrupo_izquierda">
                            <p className="creaciondegrupo">Información del grupo</p>
                                <label htmlFor="nombre" className="clases_form_label">Nombre del grupo</label>
                                <p className="infogrupo">{name}</p>

                                <label htmlFor="mazmorra" className="clases_form_label">Mazmorra</label>
                                <p className="infogrupo">{mazmorra}</p>

                                <label htmlFor="dificultad" className="clases_form_label">Dificultad de piedra angular</label>
                                <p className="infogrupo">{dificultad}</p>

                                <label htmlFor="descripcion" className="clases_form_label">Descripción del grupo</label>
                                <p className="infogrupo">{descripcion}</p>
                               {liderDeGrupo==="true"?<input type="button" value="Borrar grupo" className="boton_abandonar_grupo" onClick={abandonarGrupo}/>:<input type="button" value="Abandonar" className="boton_abandonar_grupo" onClick={abandonarGrupoNoLider}/>} 
                            </div>
                            </>
                            : 
                            <>  
                                <p className="creaciondegrupo">Información del grupo</p>
                                <label htmlFor="nombre" className="clases_form_label">Nombre del grupo</label>
                                <input type="text" id="nombre" className="clases_form_input"  onChange={(e) => setName(e.target.value)} value={name}></input>

                                <label htmlFor="mazmorra" className="clases_form_label">Mazmorra</label>
                                <select type="text" id="mazmorra" className="clases_form_select" onChange={(e) => setMazmorra(e.target.value)} value={mazmorra}>
                                    <option value="Bajapeste">Bajapeste</option>
                                    <option value="Estela Necrotica">Estela Necrotica</option>
                                    <option value="Salas de la Expiación">Salas de la Expiación</option>
                                    <option value="El Otro Lado">El Otro Lado</option>
                                    <option value="Teatro del Dolor">Teatro del Dolor</option>
                                    <option value="Nieblas de Tirna Scithe">Nieblas de Tirna Scithe</option>
                                    <option value="Agujas de Ascensión">Agujas de Ascensión</option>
                                    <option value="Cavernas Sanguinas">Cavernas Sanguinas</option>
                                </select>

                                <label htmlFor="dificultad" className="clases_form_label">Selecciona la dificultad</label>
                                <select id="dificultad" className="clases_form_select" onChange={(e) => setDificultad(e.target.value)} value={dificultad}>
                                    <option value="0">0</option>
                                    <option value="+1">+1</option>
                                    <option value="+2">+2</option>
                                    <option value="+3">+3</option>
                                    <option value="+4">+4</option>
                                    <option value="+5">+5</option>
                                    <option value="+6">+6</option>
                                    <option value="+7">+7</option>
                                    <option value="+8">+8</option>
                                    <option value="+9">+9</option>
                                    <option value="+10">+10</option>
                                    <option value="+11">+11</option>
                                    <option value="+12">+12</option>
                                    <option value="+13">+13</option>
                                    <option value="+14">+14</option>
                                    <option value="+15">+15</option>
                                    <option value="+16">+16</option>
                                    <option value="+17">+17</option>
                                    <option value="+18">+18</option>
                                    <option value="+19">+19</option>
                                    <option value="+20">+20</option>
                                </select>

                                <label htmlFor="descripcion" className="clases_form_label">Descripción del grupo</label>
                                <textarea name="" id="descripcion" cols="10" rows="10" className="clases_form_textarea" onChange={(e) => setDescripcion(e.target.value)} value={descripcion}></textarea>
                                {
                                    characterList.length===0 ? 
                                        <>
                                            <p className="errorPersonajes">¡Debes añadir un personaje a tu lista antes de poder crear un grupo!</p>
                                        </>
                                    
                                    :

                                    <>
                                        <label htmlFor="personaje" className="clases_form_label">Selecciona tu personaje</label>
                                        <select id="personaje" className="clases_form_select" onChange={(e) => setCharacter_name(e.target.value)} value={character_name} defaultValue={characterList[0].name}>
                                        {characterList.map((character,key)=>
                                            <option value={character.name} key = {key}>{character.name+"-"+character.realm}</option>
                                            )
                                        }
                                </select>
                                <input type="button" value="Guardar" className="boton__guardar__grupo" onClick={crearGrupo}/>
                            </>
                            
                            
                        }
                            </>
                        
                        }
                        
                        

                        
                        

                    </div>
                    {group_id !=="null" ? 
                        
                    <>
                    <div className="main__contenedor_derecha">
                        <label htmlFor="tablagrupo" className="clases_form_label_candidatos">Participantes</label>
                        <table id="tablagrupo" className="tablagrupo">
                            <thead>
                                <tr>
                                    <th className="primerTd">Nombre y reino</th>
                                    <th className="segundoTd">Elo</th>
                                    <th className="tercerTd">Rol</th>
                                    <th className="cuartoTd">Battletag</th>
                                    <th className="quintoTd">Acción</th>
                                </tr>
                            </thead>
                        <tbody>
                            {characterListGroup.map((character,key)=>
                            <tr key={key}>
                                <td className={"primerTd "+character.clase}>{character.name+"-"+character.realm}</td>
                                <td className="segundoTd">{character.elo}</td>
                                <td className="tercerTd"><img src={"./img/"+character.rol+".png"} alt="" /></td>
                                <td className="cuartoTd">{character.battletag}</td>
                                <td className="quintoTd">   {liderDeGrupo === "true" ? <button className="boton__tabla" onClick={()=>{echarPersona(character.user_id)}}><FontAwesomeIcon icon={faTimes}/> </button> : <button className="boton__tabla disabled" disabled><FontAwesomeIcon icon={faTimes}/></button>}</td>
                            
                            </tr>
                            
                            )}
                           
                            
                            
                        </tbody>
                        </table>

                        <label htmlFor="tablacandidatos" className="clases_form_label_candidatos">Candidatos</label>
                        <div className="tablascroll">
                        <table id="tablacandidatos" className="tablacandidatos">
                            <thead>
                                <tr>
                                <th className="primerTd ">Nombre y reino</th>
                                <th className="segundoTd">Elo</th>
                                <th className="tercerTd">Rol</th>
                                <th className="cuartoTd">Battletag</th>
                                <th className="boton__reload" onClick={()=>setNumero(numero+1)}><FontAwesomeIcon icon={faSync}></FontAwesomeIcon></th>
                                </tr>
                            </thead>
                        <tbody>
                        {characterListCola.map((character,key)=>
                            <tr key={key}>
                                <td className={"primerTd "+character.clase}>{character.name+"-"+character.realm}</td>
                                <td className="segundoTd">{character.elo}</td>
                                <td className="tercerTd"><img src={"./img/"+character.rol+".png"} alt="" /></td>
                                <td className="cuartoTd">{character.battletag}</td>
                                {liderDeGrupo === "true"?<td className="quintoTd cola">
                                    <button type="button" className="boton__tabla_cola verde" onClick={()=>{invitarPersona(character.user_id)}}><FontAwesomeIcon icon={faCheck} /></button>
                                    <button type="button" className="boton__tabla_cola rojo" onClick={()=>{echarPersona(character.user_id)}}><FontAwesomeIcon icon={faTimes}/></button>
                                </td>
                                :
                                <td className="quintoTd cola">
                                    <button type="button" className="boton__tabla_cola verdeDisabled" disabled><FontAwesomeIcon icon={faCheck} /></button>
                                    <button type="button" className="boton__tabla_cola rojoDisabled" disabled><FontAwesomeIcon icon={faTimes}/></button>
                                </td> 
                                }
                                
                            
                            </tr>
                            
                            )}
                        </tbody>
                        </table>
                        </div>
                        


                    </div>
                    </>
                        
                    : 
                    tamano ==="main__contenedor_izquierda" && setTamano("main__contenedor_izquierda ancho")
                    
                }
                </div>
            </div>
            </main>
        
        </>
    )
    }
export default GroupCreation
