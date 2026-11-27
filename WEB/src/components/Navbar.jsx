import logo from "../assets/3.png";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { obtenerUsuario, cerrarSesion } from "../services/auth";

export default function Navbar({ openSidebar }) {
  const navigate = useNavigate();
  const usuario = obtenerUsuario();
  const salir = async () => {
    if (!window.confirm("¿Quieres cerrar la sesión actual?")) return;
    try { await cerrarSesion(); }
    catch (error) { console.error("No se pudo revocar sesión:", error); alert("No se pudo confirmar el cierre de sesión en el servidor."); }
    navigate("/login", { replace: true });
  };
  return (
    <nav className="navbar-home">
      <button className="menu-btn" onClick={openSidebar}>☰</button>
      <div className="logo-container"><img src={logo} alt="Death-Art" className="navbar-logo" /></div>
      <button className="profile-btn" title="Cerrar sesión" onClick={salir}>
        {usuario ? usuario.nombre : <FaUserCircle />}
      </button>
    </nav>
  );
}
