import logo from "../assets/3.png";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { obtenerUsuario, cerrarSesionLocal } from "../services/auth";

export default function Navbar({ openSidebar }) {

  const navigate = useNavigate();

  const usuario = obtenerUsuario();

  const cerrarSesion = () => {

    const confirmar = window.confirm(
      "¿Quieres cerrar la sesión actual?"
    );

    if (!confirmar) return;

    cerrarSesionLocal();

    navigate("/login", { replace: true });

  };

  return (

    <nav className="navbar-home">

      <button
        className="menu-btn"
        onClick={openSidebar}
      >
        ☰
      </button>

      <div className="logo-container">

        <img
          src={logo}
          alt="Death-Art"
          className="navbar-logo"
        />

      </div>

      <button
        className="profile-btn"
        title="Cerrar sesión"
        onClick={cerrarSesion}
      >

        {usuario
          ? usuario.nombre
          : <FaUserCircle />
        }

      </button>

    </nav>

  );

}