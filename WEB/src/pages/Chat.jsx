import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import logo from "../assets/logo.png";
import Footer from "../components/Footer";

import "../styles/Chat.css";

export default function Chat() {

  const { id } = useParams();

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  const [artista, setArtista] = useState(null);

  const [mensajes, setMensajes] = useState([]);

  const [texto, setTexto] = useState("");

  useEffect(() => {

    obtenerArtista();

    obtenerMensajes();

  }, [id]);

  const obtenerArtista = () => {

    fetch(`https://death-art.onrender.com/artista/${id}`)

      .then(res => res.json())

      .then(data => {

        setArtista(data);

      })

      .catch(console.log);

  };

  const obtenerMensajes = () => {

    fetch(

      `https://death-art.onrender.com/chat/${usuario.id}/${id}`

    )

      .then(res => res.json())

      .then(data => {

        setMensajes(data);

      })

      .catch(console.log);

  };

  const enviarMensaje = async () => {

    if (texto.trim() === "") return;

    try {

      const response = await fetch(

        "https://death-art.onrender.com/mensajes",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify({

            remitente_id: usuario.id,

            receptor_id: id,

            mensaje: texto

          })

        }

      );

      const data = await response.json();

      alert(data.message);

      setTexto("");

      obtenerMensajes();

    }

    catch(error){

      console.log(error);

    }

  };

  if(!artista){

    return <h2>Cargando...</h2>;

  }

  return(

    <div className="chat-page">

      <header className="navbar">

        <Link to="/home">

          <img

            src={logo}

            alt="logo"

            className="logo"

          />

        </Link>

      </header>

      <div className="chat-container">

        <h1>

          Chat con {artista.nombre}

        </h1>

        <div className="messages-container">

          {

            mensajes.map(msg=>(

              <div

                key={msg.id}

                className={

                  msg.remitente_id===usuario.id

                  ? "message user"

                  : "message artist"

                }

              >

                {msg.mensaje}

              </div>

            ))

          }

        </div>

        <div className="chat-input">

          <input

            type="text"

            value={texto}

            placeholder="Escribe un mensaje..."

            onChange={(e)=>setTexto(e.target.value)}

            onKeyDown={(e)=>{

              if(e.key==="Enter"){

                enviarMensaje();

              }

            }}

          />

          <button

            onClick={enviarMensaje}

          >

            Enviar

          </button>

        </div>

      </div>

      <Footer/>

    </div>

  );

}