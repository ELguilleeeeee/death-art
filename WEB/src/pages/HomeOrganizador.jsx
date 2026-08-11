import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/HomeOrganizador.css";

export default function HomeOrganizador() {

  const navigate = useNavigate();

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  return (

    <div className="home-page">

      <Navbar />

      <section className="artista-home">

        <div className="artista-card">

          <h1>

            Bienvenido,

            <span>

              {" "}{usuario?.nombre}

            </span>

          </h1>

          <p>

            Desde este panel podrás administrar todas tus publicaciones,
            consultar tus mensajes y mantener actualizado tu portafolio artístico.

          </p>

          <div className="artista-botones">

            <button

              onClick={() =>
                navigate("/mis-obras")
              }

            >

               Mis Obras

            </button>

            <button
             onClick={()=>
              navigate("/mensajes")
             }>

               Mensajes

            </button>

            <button>

               Mi Perfil

            </button>

          </div>

        </div>

      </section>

      <Footer />

    </div>

  );

}