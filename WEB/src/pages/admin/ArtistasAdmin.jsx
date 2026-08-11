import { useEffect, useState } from "react";

import "../../styles/ArtistasAdmin.css";

export default function ArtistasAdmin() {

  const [artistas, setArtistas] = useState([]);

  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {

    obtenerArtistas();

  }, []);

  const obtenerArtistas = () => {

    fetch("https://death-art.onrender.com/artistas-pendientes")

      .then(res => res.json())

      .then(data => setArtistas(data))

      .catch(err => console.log(err));

  };

  const aprobar = async(id)=>{

    if(!window.confirm("¿Aprobar artista?")) return;

    const response=await fetch(

      `https://death-art.onrender.com/aprobar-artista/${id}`,

      {

        method:"PUT"

      }

    );

    const data=await response.json();

    alert(data.message);

    obtenerArtistas();

  };

  const rechazar=async(id)=>{

    if(!window.confirm("¿Rechazar artista?")) return;

    const response=await fetch(

      `https://death-art.onrender.com/rechazar-artista/${id}`,

      {

        method:"PUT"

      }

    );

    const data=await response.json();

    alert(data.message);

    obtenerArtistas();

  };

  const filtrados = artistas.filter(a =>

    a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||

    a.correo.toLowerCase().includes(busqueda.toLowerCase())

  );

  return(

    <div className="artistas-admin">

      <h1>

        Solicitudes de Artistas

      </h1>

      <input

        className="buscar"

        placeholder="Buscar artista..."

        value={busqueda}

        onChange={(e)=>setBusqueda(e.target.value)}

      />

      <div className="cards-artistas">

        {

          filtrados.map(artista=>(

            <div

              className="card-artista"

              key={artista.id}

            >

              <div className="avatar">

                🎨

              </div>

              <h3>

                {artista.nombre}

              </h3>

              <p>

                {artista.correo}

              </p>

              <span className="estado">

                {artista.estado}

              </span>

              <div className="acciones">

                <button

                  className="aprobar"

                  onClick={()=>aprobar(artista.id)}

                >

                  ✔ Aprobar

                </button>

                <button

                  className="rechazar"

                  onClick={()=>rechazar(artista.id)}

                >

                  ✖ Rechazar

                </button>

              </div>

            </div>

          ))

        }

      </div>

    </div>

  );

}