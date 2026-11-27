import "./../styles/Sidebar.css";
import { Link, useNavigate } from "react-router-dom";
import { obtenerUsuario, cerrarSesion } from "../services/auth";
export default function Sidebar({ isOpen, closeSidebar }) {
  const navigate = useNavigate();
  const usuario = obtenerUsuario();
  const salir = async () => {
    if (!window.confirm("¿Quieres cerrar la sesión actual?")) return;
    try { await cerrarSesion(); }
    catch (error) { console.error("No se pudo revocar sesión:", error); alert("No se pudo confirmar el cierre de sesión en el servidor."); }
    closeSidebar(); navigate("/login", { replace: true });
  };
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={closeSidebar}>✕</button>
        <h2>Hola, {usuario?.nombre}</h2>
        <Link className="sidebar-item" to="/home" onClick={closeSidebar}>Inicio</Link>
        <Link className="sidebar-item" to="/perfil" onClick={closeSidebar}>Mi Perfil</Link>
        <Link className="sidebar-item" to="/eventos" onClick={closeSidebar}>Artistas</Link>
        {usuario?.tipo === "artista" && <Link className="sidebar-item" to="/mis-obras" onClick={closeSidebar}>Mis Obras</Link>}
        {usuario?.tipo === "admin" && <Link className="sidebar-item" to="/admin" onClick={closeSidebar}>Administración</Link>}
        <button className="logout-btn" onClick={salir}>Cerrar Sesión</button>
      </div>
    </>
  );
}
