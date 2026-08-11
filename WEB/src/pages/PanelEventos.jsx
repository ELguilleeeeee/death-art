import { useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PanelEventos() {

  const [mostrarModal, setMostrarModal] = useState(false);

  const [formData, setFormData] = useState({
    titulo: "",
    categoria: "",
    fecha: "",
    hora: "",
    ubicacion: "",
    capacidad: "",
    descripcion: ""
  });

  const [imagen, setImagen] = useState(null);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleImagen = (e) => {

    if (e.target.files.length > 0) {

      setImagen(e.target.files[0]);

    }

  };

  const guardarEvento = () => {

    console.log(formData);
    console.log(imagen);

    alert("En el siguiente paso lo conectaremos a la BD.");

  };

  return (

    <div className="home-page">

      <Navbar />

      <div
        style={{
          color: "white",
          paddingTop: "120px",
          width: "90%",
          margin: "auto"
        }}
      >

        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px"
          }}
        >
          📋 Panel de Eventos
        </h1>

        <button
          className="main-btn"
          onClick={() => setMostrarModal(true)}
        >
          ➕ Nuevo Evento
        </button>

        <div
          style={{
            marginTop: "40px",
            background: "#fff",
            color: "#000",
            padding: "30px",
            borderRadius: "15px",
            textAlign: "center"
          }}
        >

          No hay eventos registrados.

        </div>

      </div>

      {mostrarModal && (

        <div className="modal-overlay">

          <div className="modal-evento">

            <h2>Nuevo Evento</h2>

            <input
              type="text"
              name="titulo"
              placeholder="Título"
              value={formData.titulo}
              onChange={handleChange}
            />

            <input
              type="text"
              name="categoria"
              placeholder="Categoría"
              value={formData.categoria}
              onChange={handleChange}
            />

            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
            />

            <input
              type="time"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
            />

            <input
              type="text"
              name="ubicacion"
              placeholder="Ubicación"
              value={formData.ubicacion}
              onChange={handleChange}
            />

            <input
              type="number"
              name="capacidad"
              placeholder="Capacidad"
              value={formData.capacidad}
              onChange={handleChange}
            />

            {/* Imagen */}

            <input
              type="file"
              accept="image/*"
              onChange={handleImagen}
            />

            {/* Vista previa */}

            {imagen && (

              <img
                src={URL.createObjectURL(imagen)}
                alt="Vista previa"
                style={{
                  width: "100%",
                  maxHeight: "220px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginTop: "10px"
                }}
              />

            )}

            <textarea
              name="descripcion"
              placeholder="Descripción"
              rows="5"
              value={formData.descripcion}
              onChange={handleChange}
            />

            <div className="modal-buttons">

              <button
                className="main-btn"
                onClick={guardarEvento}
              >
                Guardar
              </button>

              <button
                className="cancel-btn"
                onClick={() => setMostrarModal(false)}
              >
                Cancelar
              </button>

            </div>

          </div>

        </div>

      )}

      <Footer />

    </div>

  );

}