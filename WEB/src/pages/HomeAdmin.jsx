import { useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import SidebarAdmin from "./SidebarAdmin";

import DashboardAdmin from "./admin/DashboardAdmin";
import ArtistasAdmin from "./admin/ArtistasAdmin";
import GaleriaAdmin from "./admin/GaleriaAdmin";
import EventosAdmin from "./admin/EventosAdmin";
import UsuariosAdmin from "./admin/UsuariosAdmin";
import ConfiguracionAdmin from "./admin/ConfiguracionAdmin";

import "../styles/Home.css";
import "../styles/HomeAdmin.css";

export default function HomeAdmin() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [seccion, setSeccion] = useState("dashboard");

  const renderSeccion = () => {

    switch (seccion) {

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

      <Navbar
        openSidebar={() => setSidebarOpen(true)}
      />

      <div className="admin-layout">

        <SidebarAdmin
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
          seccion={seccion}
          setSeccion={setSeccion}
        />

        <div className="admin-content">

          {renderSeccion()}

        </div>

      </div>

      <Footer />

    </div>

  );

}