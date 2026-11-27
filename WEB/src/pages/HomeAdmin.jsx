
import { useState } from "react";

// Componentes generales
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Menú lateral del administrador
import SidebarAdmin from "./SidebarAdmin";

// Secciones del administrador
import DashboardAdmin from "./admin/DashboardAdmin";
import ArtistasAdmin from "./admin/ArtistasAdmin";
import GaleriaAdmin from "./admin/GaleriaAdmin";
import EventosAdmin from "./admin/EventosAdmin";
import UsuariosAdmin from "./admin/UsuariosAdmin";
import ConfiguracionAdmin from "./admin/ConfiguracionAdmin";

// Estilos
import "../styles/Home.css";
import "../styles/HomeAdmin.css";

export default function HomeAdmin() {

  // Controlar la apertura del menú lateral
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sección activa del administrador
  const [seccion, setSeccion] = useState("dashboard");

  // Abrir menú lateral
  const abrirSidebar = () => {
    setSidebarOpen(true);
  };

  // Cerrar menú lateral
  const cerrarSidebar = () => {
    setSidebarOpen(false);
  };

  // Cambiar la sección del administrador
  const cambiarSeccion = (nuevaSeccion) => {
    setSeccion(nuevaSeccion);
    cerrarSidebar();
  };

  // Mostrar el componente correspondiente
  const renderSeccion = () => {
    switch (seccion) {

      case "dashboard":
        return <DashboardAdmin />;

      case "artistas":
        return <ArtistasAdmin />;

      case "galeria":
        return <GaleriaAdmin />;

      case "eventos":
        return <EventosAdmin />;

      case "usuarios":
        return <UsuariosAdmin />;

      case "configuracion":
        return <ConfiguracionAdmin />;

      default:
        return <DashboardAdmin />;
    }
  };

  return (
    <div className="home-page">

      {/* Barra superior */}
      <Navbar openSidebar={abrirSidebar} />

      {/* Contenido administrativo */}
      <div className="admin-layout">

        {/* Menú lateral */}
        <SidebarAdmin
          isOpen={sidebarOpen}
          closeSidebar={cerrarSidebar}
          seccion={seccion}
          setSeccion={cambiarSeccion}
        />

        {/* Sección seleccionada */}
        <main className="admin-content">
          {renderSeccion()}
        </main>

      </div>

      {/* Pie de página */}
      <Footer />

    </div>
  );
}
