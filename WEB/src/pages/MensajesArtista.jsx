import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/MensajesArtista.css";

export default function MensajesArtista(){

const usuario=JSON.parse(
localStorage.getItem("usuario")
);

const [mensajes,setMensajes]=useState([]);

const [respuesta,setRespuesta]=useState("");

const [chat,setChat]=useState(null);

useEffect(()=>{

obtenerMensajes();

},[]);

const obtenerMensajes=()=>{

fetch(
`https://death-art.onrender.com/mensajes/${usuario.id}`
)

.then(res=>res.json())

.then(data=>{

setMensajes(data);

});

};

const abrirChat=(mensaje)=>{

setChat(mensaje);

};

const responder=async()=>{

if(!respuesta.trim()) return;

await fetch(
"https://death-art.onrender.com/mensajes",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

remitente_id:usuario.id,

receptor_id:chat.remitente_id,

mensaje:respuesta

})

}

);

alert("Respuesta enviada");

setRespuesta("");

obtenerMensajes();

};

return(

<div className="home-page">

<Navbar/>

<div className="mensajes-container">

<div className="lista-chats">

<h2>Mensajes</h2>

{

mensajes.map(m=>(

<div

key={m.id}

className="chat-item"

onClick={()=>abrirChat(m)}

>

<h3>{m.nombre}</h3>

<p>{m.mensaje}</p>

</div>

))

}

</div>

<div className="chat-panel">

{

chat ?

<>

<h2>{chat.nombre}</h2>

<p>{chat.mensaje}</p>

<textarea

placeholder="Responder..."

value={respuesta}

onChange={(e)=>setRespuesta(e.target.value)}

/>

<button

onClick={responder}

>

Enviar respuesta

</button>

</>

:

<h2>

Selecciona un mensaje

</h2>

}

</div>

</div>

<Footer/>

</div>

);

}