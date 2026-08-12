import "./../styles/Sidebar.css";
import { Link } from "react-router-dom";

export default function Sidebar({
  isOpen,
  closeSidebar
}) {

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  const cerrarSesion = () => {

    const confirmar = window.confirm(
      "¿Quieres cerrar la sesión actual?"
    );

    if (!confirmar) return;

    localStorage.removeItem("usuario");

    navigate("/login", { replace: true });

  };

  return (

    <>

      {isOpen && (

        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />

      )}

      <div
        className={`sidebar ${
          isOpen ? "open" : ""
        }`}
      >

        <button
          className="close-btn"
          onClick={closeSidebar}
        >
          ✕
        </button>

        <h2>
          Hola, {usuario?.nombre}
        </h2>

        <Link
          className="sidebar-item"
          to="/home"
          onClick={closeSidebar}
        >
           Inicio
        </Link>

        <Link
          className="sidebar-item"
          to="/perfil"
          onClick={closeSidebar}
        >
          Mi Perfil
        </Link>

        <Link
          className="sidebar-item"
          to="/eventos"
          onClick={closeSidebar}
        >
           Artistas
        </Link>

        {usuario?.tipo === "artista" && (

          <Link
            className="sidebar-item"
            to="/mis-obras"
            onClick={closeSidebar}
          >
             Mis Obras
          </Link>

        )}

        {usuario?.tipo === "admin" && (

          <Link
            className="sidebar-item"
            to="/admin"
            onClick={closeSidebar}
          >
             Administración
          </Link>

        )}

        <button
          className="logout-btn"
          onClick={cerrarSesion}
        >
           Cerrar Sesión
        </button>

      </div>

    </>

  );

}