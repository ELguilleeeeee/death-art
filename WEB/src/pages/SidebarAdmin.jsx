import "../styles/Sidebar.css";

export default function SidebarAdmin({
  isOpen,
  closeSidebar,
  seccion,
  setSeccion
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

    window.location.href = "/login";

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
          Administrador
        </h2>

        <p
          style={{
            color: "#fff",
            textAlign: "center",
            marginBottom: "25px"
          }}
        >
          {usuario?.nombre}
        </p>

        <button
          className="sidebar-item"
          onClick={() => {

            setSeccion("dashboard");

            closeSidebar();

          }}
        >
          🏠 Dashboard
        </button>

        <button
          className="sidebar-item"
          onClick={() => {

            setSeccion("artistas");

            closeSidebar();

          }}
        >
          🎨 Solicitudes de Artistas
        </button>

        <button
          className="sidebar-item"
          onClick={() => {

            setSeccion("galeria");

            closeSidebar();

          }}
        >
          🖼️ Galería del Mes
        </button>

        <button
          className="sidebar-item"
          onClick={() => {

            setSeccion("eventos");

            closeSidebar();

          }}
        >
          📅 Eventos
        </button>

        <button
          className="sidebar-item"
          onClick={() => {

            setSeccion("usuarios");

            closeSidebar();

          }}
        >
          👥 Usuarios
        </button>

        <button
          className="sidebar-item"
          onClick={() => {

            setSeccion("configuracion");

            closeSidebar();

          }}
        >
          ⚙️ Configuración
        </button>

        <button
          className="logout-btn"
          onClick={cerrarSesion}
        >
          🚪 Cerrar sesión
        </button>

      </div>

    </>

  );

}