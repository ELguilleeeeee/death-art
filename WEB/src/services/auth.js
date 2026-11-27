// Las sesiones se guardan en cookies HttpOnly a través de /api (Rewrite de Render).
// localStorage conserva solo datos de presentación, nunca una prueba de identidad.
export function obtenerUsuario() {
  try {
    const datos = localStorage.getItem("usuario");
    return datos ? JSON.parse(datos) : null;
  } catch {
    return null;
  }
}
export async function consultarSesion() {
  const respuesta = await fetch("/api/auth/me", {
    credentials: "same-origin", cache: "no-store"
  });
  if (!respuesta.ok) return null;
  const usuario = await respuesta.json();
  localStorage.setItem("usuario", JSON.stringify(usuario));
  return usuario;
}
export function cerrarSesionLocal() {
  localStorage.removeItem("usuario");
}
export async function cerrarSesion() {
  try {
    const respuesta = await fetch("/api/logout", {
      method: "POST", credentials: "same-origin"
    });
    if (!respuesta.ok && respuesta.status !== 401) {
      throw new Error(`Logout HTTP ${respuesta.status}`);
    }
  } finally {
    cerrarSesionLocal();
  }
}
