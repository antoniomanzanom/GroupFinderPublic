import React from 'react'
import { useState,useEffect} from 'react'
import "./groupFinder.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync,faSignInAlt,faHourglassHalf } from '@fortawesome/free-solid-svg-icons'

const GroupFinder = (props) => {

    const [characterList,setCharacterList] = useState([])
    const [character_name, setCharacter_name] = useState("")
    const [groups, setGroups] = useState([])
    const [numero,setNumero] = useState(1)
    const [textoBoton, setTextoBoton] = useState("Unirse")
    var user_id = window.localStorage.getItem('user_id')

    useEffect(() => {
        props.setPage("Groupfinder")
        cargarPersonajes()
        cargarGrupos()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numero])

    const cargarPersonajes= async () => {
        const res = await fetch("http://127.0.0.1:5000/characters/"+user_id,{
                method:"GET",
                headers: {
                    "Content-type": "application/json",
                  }
            })
            const data = await res.json();
            setCharacterList(data.characters)
            if (data.characters.length>0){
                setCharacter_name(data.characters[0].name)
            }
        }

    const cargarGrupos = async() => {
        const res = await fetch("http://127.0.0.1:5000/groups" ,{
                method:"GET",
                headers: {
                    "Content-type": "application/json",
                  }
            })
        const data = await res.json()
        console.log(data.groups)
        setGroups(data.groups)
        
    }
    const unirseGrupo = async (grupoid) =>{
        const res = await fetch("http://127.0.0.1:5000/group/"+grupoid+"/request/"+user_id ,{
            method:"POST",
            headers: {
                "Content-type": "application/json",
              },
            body:JSON.stringify({
                current_character: character_name,
              }),
        })
        if(res.status===200){
            setTextoBoton("boton"+grupoid)
            localStorage.setItem('group_id',grupoid)
            localStorage.setItem('liderDeGrupo',false)
        }
        
    }
    return (
        <>
            <main className="body__main__gf">
            <div className="main__div__gf">
                <figure className="maindiv__figure">
                    <img src="./img/Banner-2.jpg" alt="Imagen de Shadowlands"></img>
                    <figcaption></figcaption>
                </figure>
                <h1 className="h1_groupcreation">BUSCADOR DE GRUPOS</h1>

                {
                        characterList.length===0 ? 
                            <>
                                <p className="errorPersonajes">¡Debes añadir un personaje a tu lista antes de poder acceder a un grupo!</p>
                            </>
                        
                        :

                        <>
                            <label htmlFor="personaje" className="clases_form_label">Selecciona tu personaje</label>
                            <select id="personaje" className="clases_form_select" onChange={(e) => setCharacter_name(e.target.value)} defaultValue={characterList[0].name}>
                            {characterList.map((character,key)=>
                                <option value={character.name} key = {key}>{character.name+"-"+character.realm}</option>
                                )
                            }
                    </select>
                </>
                                         
                }

                <div className="div__tablagrupos">
                    
                            {
                               
                                groups.length===0 ? 
                                <p className="p__nogroups">No hay ningún grupo disponible en estos momentos</p>
                                
                                :<>
                                <table className="tablagrupos">
                                <thead>
                                    <tr>
                                        <th className="nombretd">Nombre</th>
                                        <th className="descripciontd">Descripción</th>
                                        <th className="mazmorratd">Mazmorra</th>
                                        <th className="dificultadtd">Dificultad</th>
                                        <th className="rolestd">Roles</th>
                                        <th className="boton__reload" onClick={()=>setNumero(numero+1)}><FontAwesomeIcon icon={faSync}></FontAwesomeIcon></th>
                                    </tr>
                                </thead>
                                <tbody>
                                {groups.map((group,key)=>
                                    <tr key={key}>
                                        <td className="nombretd">{group.name}</td>
                                        <td className="descripciontd">{group.descripcion}</td>
                                        <td className="mazmorratd">{group.mazmorra}</td>
                                        <td className="dificultadtd">{group.dificultad}</td>
                                        <td className="rolestd">
                                            {group.roles.split(",").length===1 ? 
                                            
                                                <img src={"./img/"+group.roles+".png"} alt="rol del personaje"></img>
                                            :
                                            
                                                group.roles.split(",").map((rol)=>
                                                    <img src={"./img/"+rol+".png"} alt="rol del personaje"></img>
                                                )
                                            
                                            }
                                        </td>
                                        <td className="botontd">
                                            {/* <input type="button" value={textoBoton==="boton"+group.id ? "Esperando...":"Unirse"} onClick={()=>{unirseGrupo(group.id)}} className="boton__tabla__gf"/> */}
                                            <button onClick={()=>{unirseGrupo(group.id)}} className="boton__tabla__gf">{textoBoton==="boton"+group.id ? <FontAwesomeIcon icon={faHourglassHalf}></FontAwesomeIcon>:<FontAwesomeIcon icon={faSignInAlt}></FontAwesomeIcon>}</button>
                                            </td>
                                    </tr>
                                )}
                                </tbody>
                                </table>
                                </>
                            
                            }
                        
                </div>
                    
            </div>
            </main>
            <script src="https://kit.fontawesome.com/be6ef001a7.js" crossOrigin="anonymous"></script>
        </>
    )
}

export default GroupFinder
