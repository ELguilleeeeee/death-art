import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "../styles/Profile.css";
import Footer from "../components/Footer";

import logo from "../assets/3.png";

export default function ArtistProfile() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [artist, setArtist] = useState(null);

  useEffect(() => {

    fetch("/artists.json")

      .then(res => res.json())

      .then(data => {

        const evento = data.find(
          a => a.id === parseInt(id)
        );

        setArtist(evento);

      })

      .catch(error => console.log(error));

  }, [id]);

  if (!artist) {

    return <h2>Cargando...</h2>;

  }

  return (

    <div className="artist-page">

      {/* HEADER */}
      <header className="navbar">

        <button className="menu-btn">
          ☰
        </button>

        <Link to="/">
          <img
            src={logo}
            alt="Death-Art"
            className="navbar-logo"
          />
        </Link>

        <button className="profile-btn">
          👤
        </button>

      </header>

      {/* CONTENIDO */}
      <div className="artist-container">

        <img
          src={artist.image}
          alt={artist.name}
          className="artist-photo"
        />

        <h1>{artist.name}</h1>

        <h3>{artist.city}</h3>

        <div className="artist-description">

          <h2>Información del evento</h2>

          <p>{artist.description}</p>

          <p>
            Categoría: {artist.category}
          </p>

          <p>
            Fecha: {artist.date}
          </p>

        </div>

        <button
          className="contact-btn"
          onClick={() => navigate(`/chat/${artist.id}`)}
        >
          Contactar
        </button>

        <div className="artist-socials">

          <a href="#">Facebook</a>

          <a href="#">Instagram</a>

          <a href="#">WhatsApp</a>

        </div>

        <div className="artist-gallery">

          <div className="gallery-box"></div>

          <div className="gallery-info">

            <h2>Cronograma</h2>

            <p>
              Aquí se mostrarán las actividades del evento.
            </p>

          </div>

        </div>

      </div>

      <Footer />

    </div>

  );

}