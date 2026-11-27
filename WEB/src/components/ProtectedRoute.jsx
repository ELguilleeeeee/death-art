import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { consultarSesion } from "../services/auth";

export default function ProtectedRoute({ children, allowedRoles }) {
  const [estado, setEstado] = useState({ cargando: true, usuario: null });
  useEffect(() => {
    let activo = true;
    consultarSesion()
      .then(usuario => {
        if (activo) setEstado({ cargando: false, usuario });
      })
      .catch(() => {
        if (activo) setEstado({ cargando: false, usuario: null });
      });
    return () => { activo = false; };
  }, []);

  if (estado.cargando) return <p>Verificando sesión…</p>;
  if (!estado.usuario) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(estado.usuario.tipo)) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
