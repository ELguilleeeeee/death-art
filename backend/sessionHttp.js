// Para producción, Render debe hacer Rewrite de /api/* al backend.
const cookieSesion = "__Host-da_session";
const opcionesCookie = {
  httpOnly: true, secure: true, sameSite: "lax", path: "/",
  maxAge: 2 * 60 * 60 * 1000
};
const limpiarCookie = { httpOnly: true, secure: true, sameSite: "lax", path: "/" };
const origenes = new Set([
  "https://death-art-web.onrender.com",
  "http://localhost:5173"
]);
function validarOrigen(req, res, next) {
  const origin = req.get("Origin");
  if (!origin || !origenes.has(origin)) {
    return res.status(403).json({ message: "Origen no autorizado" });
  }
  return next();
}
module.exports = { cookieSesion, opcionesCookie, limpiarCookie, validarOrigen };
