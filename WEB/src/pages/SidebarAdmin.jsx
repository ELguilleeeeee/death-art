import "../styles/Sidebar.css";
import { useNavigate } from "react-router-dom";
import { obtenerUsuario, cerrarSesion } from "../services/auth";
export default function SidebarAdmin({ isOpen, closeSidebar, seccion, setSeccion }) {
  const navigate = useNavigate();
  const usuario = obtenerUsuario();
  const salir = async () => {
    if (!window.confirm("¿Quieres cerrar la sesión actual?")) return;
    try { await cerrarSesion(); }
    catch (error) { console.error("No se pudo revocar sesión:", error); alert("No se pudo confirmar el cierre de sesión en el servidor."); }
    closeSidebar(); navigate("/login", { replace: true });
  };
  const cambiar = nombre => { setSeccion(nombre); closeSidebar(); };
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={closeSidebar}>✕</button>
        <h2>Administrador</h2>
        <p style={{ color: "#fff", textAlign: "center", marginBottom: "25px" }}>{usuario?.nombre}</p>
        <button className="sidebar-item" onClick={() => cambiar("dashboard")}>🏠 Dashboard</button>
        <button className="sidebar-item" onClick={() => cambiar("artistas")}>🎨 Solicitudes de Artistas</button>
        <button className="sidebar-item" onClick={() => cambiar("galeria")}>🖼️ Galería del Mes</button>
        <button className="sidebar-item" onClick={() => cambiar("eventos")}>📅 Eventos</button>
        <button className="sidebar-item" onClick={() => cambiar("usuarios")}>👥 Usuarios</button>
        <button className="sidebar-item" onClick={() => cambiar("configuracion")}>⚙️ Configuración</button>
        <button className="logout-btn" onClick={salir}>🚪 Cerrar sesión</button>
      </div>
    </>
  );
}
