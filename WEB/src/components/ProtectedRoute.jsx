import { Navigate } from "react-router-dom";

export default function ProtectedRoute({

  children,

  allowedRoles

}) {

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  if (!usuario) {

    return <Navigate to="/" replace />;

  }

  if (

    allowedRoles &&

    !allowedRoles.includes(usuario.tipo)

  ) {

    return <Navigate to="/" replace />;

  }

  return children;

}