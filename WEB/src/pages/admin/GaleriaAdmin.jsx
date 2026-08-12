import { useEffect, useState } from "react";

import "../../styles/GaleriaAdmin.css";

export default function GaleriaAdmin() {

  const meses = [
    "",
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
  ];

  const [galeriaMes, setGaleriaMes] = useState([]);

  const [editando, setEditando] = useState(null);

  const [formGaleria, setFormGaleria] = useState({

    mes: "",

    movimiento: "",

    artista: "",

    frase: "",

    imagen: null

  });

  useEffect(() => {

    obtenerGaleria();

  }, []);

  const obtenerGaleria = () => {

    fetch("https://death-art.onrender.com/galeria-mes")

      .then(res => res.json())

      .then(data => setGaleriaMes(data))

      .catch(err => console.log(err));

  };

  const handleChange = (e) => {

    setFormGaleria({

      ...formGaleria,

      [e.target.name]: e.target.value

    });

  };

  const handleImagen = (e) => {

    setFormGaleria({

      ...formGaleria,

      imagen: e.target.files[0]

    });

  };

  const guardarGaleria = async () => {

    const formData = new FormData();

    formData.append("mes", formGaleria.mes);

    formData.append("movimiento", formGaleria.movimiento);

    formData.append("artista", formGaleria.artista);

    formData.append("frase", formGaleria.frase);

    if (formGaleria.imagen) {

      formData.append("imagen", formGaleria.imagen);

    }

    const url = editando
      ? `https://death-art.onrender.com/galeria-mes/${editando}`
      : "https://death-art.onrender.com/galeria-mes";

    const metodo = editando
      ? "PUT"
      : "POST";

    const response = await fetch(url, {

      method: metodo,

      body: formData

    });

    const data = await response.json();

    alert(data.message);

    setFormGaleria({

      mes: "",

      movimiento: "",

      artista: "",

      frase: "",

      imagen: null

    });

    setEditando(null);

    obtenerGaleria();

  };

  const editarGaleria = (item) => {

    setEditando(item.id);

    setFormGaleria({

      mes: item.mes,

      movimiento: item.movimiento,

      artista: item.artista,

      frase: item.frase,

      imagen: null

    });

  };

  const eliminarGaleria = async (id) => {

    const confirmar = window.confirm(

      "¿Eliminar esta galería?"

    );

    if (!confirmar) return;

    const response = await fetch(

      `https://death-art.onrender.com/galeria-mes/${id}`,

      {

        method: "DELETE"

      }

    );

    const data = await response.json();

    alert(data.message);

    obtenerGaleria();

  };

  return (

    <div className="galeria-admin">

      <h1>

        Galería del Mes

      </h1>

      <div className="galeria-form">

        <select

          name="mes"

          value={formGaleria.mes}

          onChange={handleChange}

        >

          <option value="">

            Selecciona un mes

          </option>

          {

            meses.slice(1).map((mes, index) => (

              <option

                key={index + 1}

                value={index + 1}

              >

                {mes}

              </option>

            ))

          }

        </select>

        <input

          type="text"

          name="movimiento"

          placeholder="Movimiento artístico"

          value={formGaleria.movimiento}

          onChange={handleChange}

        />

        <input

          type="text"

          name="artista"

          placeholder="Artista"

          value={formGaleria.artista}

          onChange={handleChange}

        />

        <textarea

          name="frase"

          placeholder="Frase"

          value={formGaleria.frase}

          onChange={handleChange}

        />

        <input

          type="file"

          accept="image/*"

          onChange={handleImagen}

        />

        {

          formGaleria.imagen && (

            <img

              className="preview"

              src={URL.createObjectURL(formGaleria.imagen)}

              alt="preview"

            />

          )

        }

        <button

          onClick={guardarGaleria}

        >

          {

            editando

              ? "Actualizar Galería"

              : "Guardar Galería"

          }

        </button>

      </div>

      <div className="galeria-grid">

        {

          galeriaMes.map(item => (

            <div

              className="galeria-card"

              key={item.id}

            >

              <img

                src={
  item.imagen?.startsWith("http")
    ? item.imagen
    : `https://death-art.onrender.com/uploads/galeria/${item.imagen}`
}

                alt={item.artista}

              />

              <h3>

                {item.artista}

              </h3>

              <p>

                <b>Movimiento:</b> {item.movimiento}

              </p>

              <p>

                <b>Mes:</b> {meses[item.mes]}

              </p>

              <p>

                {item.frase}

              </p>

              <div className="acciones-galeria">

                <button

                  onClick={() => editarGaleria(item)}

                >

                   Editar

                </button>

                <button

                  onClick={() => eliminarGaleria(item.id)}

                >

                   Eliminar

                </button>

              </div>

            </div>

          ))

        }

      </div>

    </div>

  );

}