
export function obtenerUsuario() {
  try {
    const datos = localStorage.getItem("usuario");

    return datos ? JSON.parse(datos) : null;
  } catch {
    return null;
  }
}

export function cerrarSesionLocal() {
  localStorage.removeItem("usuario");
}
