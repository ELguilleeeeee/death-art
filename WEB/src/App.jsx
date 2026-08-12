import { HashRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Home from "./pages/Home";
import HomeOrganizador from "./pages/HomeOrganizador";
import HomeAdmin from "./pages/HomeAdmin";

import ArtistProfile from "./pages/ArtistProfile";
import Chat from "./pages/Chat";

import MensajesArtista from "./pages/MensajesArtista";

import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

import PanelEventos from "./pages/PanelEventos";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import MisObras from "./pages/MisObras";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <HashRouter>

      <Routes>

        {/* LOGIN */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />
        <Route

path="/mensajes"

element={

<ProtectedRoute
allowedRoles={["artista"]}
>

<MensajesArtista/>

</ProtectedRoute>

}

/>

        <Route
          path="/register"
          element={<Register />}
        />

        {/* HOME USUARIO */}

        <Route

          path="/home"

          element={

            <ProtectedRoute
              allowedRoles={["usuario"]}
            >

              <Home />

            </ProtectedRoute>

          }

        />

        {/* HOME ORGANIZADOR */}

        <Route
  path="/home-artista"
  element={
    <ProtectedRoute allowedRoles={["artista"]}>
      <HomeOrganizador />
    </ProtectedRoute>
  }
/>

        {/* HOME ADMIN */}

        <Route

          path="/home-admin"

          element={

            <ProtectedRoute
              allowedRoles={["admin"]}
            >

              <HomeAdmin />

            </ProtectedRoute>

          }

        />

        {/* PANEL ADMIN */}

        <Route

          path="/admin"

          element={

            <ProtectedRoute
              allowedRoles={["admin"]}
            >

              <DashboardAdmin />

            </ProtectedRoute>

          }

        />

        {/* PANEL ORGANIZADOR */}

        <Route

          path="/panel-eventos"

          element={

            <ProtectedRoute
              allowedRoles={["artista"]}
            >

              <PanelEventos />

            </ProtectedRoute>

          }

        />

        {/* MIS OBRAS */}

        <Route

          path="/mis-obras"

          element={

            <ProtectedRoute
              allowedRoles={["artista"]}
            >

              <MisObras />

            </ProtectedRoute>

          }

        />

        {/* RUTAS GENERALES */}

        <Route
          path="/artist/:id"
          element={<ArtistProfile />}
        />

        <Route
          path="/chat/:id"
          element={<Chat />}
        />

        <Route
          path="/privacy"
          element={<Privacy />}
        />

        <Route
          path="/terms"
          element={<Terms />}
        />

      </Routes>

    </HashRouter>

  );

}

export default App;