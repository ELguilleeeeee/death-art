import { useEffect, useState } from "react";

import "../styles/GaleriaMes.css";

export default function GaleriaMes() {

  const [galeria, setGaleria] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const mes = new Date().getMonth() + 1;

    fetch(`https://death-art.onrender.com/galeria-mes/${mes}`)

      .then(res => {

        if (!res.ok) {

          throw new Error("No existe galería para este mes");

        }

        return res.json();

      })

      .then(data => {

        setGaleria(data);

      })

      .catch(err => {

        console.log(err);

      })

      .finally(() => {

        setLoading(false);

      });

  }, []);

  if (loading) {

    return null;

  }

  if (!galeria) {

    return null;

  }

  return (

    <section className="hero-galeria">

      <img

        src={`https://death-art.onrender.com/uploads/galeria/${galeria.imagen}`}

        alt={galeria.movimiento}

      />

      <div className="hero-overlay">

        <span>

          Galería del Mes

        </span>

        <h1>

          {galeria.movimiento}

        </h1>

        <h2>

          Artista destacado: {galeria.artista}

        </h2>

        <p>

          "{galeria.frase}"

        </p>

        <button>

          Explorar Obras

        </button>

      </div>

    </section>

  );

}