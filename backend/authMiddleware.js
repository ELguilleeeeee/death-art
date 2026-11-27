const { verificarToken } = require("./authTokens");
const { cookieSesion } = require("./sessionHttp");
const db = require("./db");
function leerCookie(req, nombre) {
  const cabecera = req.headers.cookie || "";
  for (const fragmento of cabecera.split(";")) {
    const [clave, ...partes] = fragmento.trim().split("=");
    if (clave === nombre) return partes.join("=");
  }
  return null;
}
function autenticar(req, res, next) {
  const token = leerCookie(req, cookieSesion);
  if (!token) return res.status(401).json({ message: "Inicia sesión" });
  let claims;
  try { claims = verificarToken(token); }
  catch { return res.status(401).json({ message: "Sesión inválida o expirada" }); }
  db.query(`
    SELECT u.id, u.nombre, u.estado, r.nombre AS tipo
    FROM sesiones_usuario s
    JOIN usuarios u ON u.id = s.usuario_id
    JOIN usuario_rol ur ON ur.usuario_id = u.id
    JOIN roles r ON r.id = ur.rol_id
    WHERE s.identificador = ? AND s.usuario_id = ?
      AND s.fecha_revocacion IS NULL
      AND s.fecha_expiracion > UTC_TIMESTAMP()
    LIMIT 1
  `, [claims.identificador, claims.usuarioId], (error, rows) => {
    if (error) {
      console.error("Error autenticando:", error);
      return res.status(500).json({ message: "Error al validar sesión" });
    }
    if (!rows.length || (rows[0].tipo === "artista" && rows[0].estado !== "aprobado")) {
      return res.status(401).json({ message: "Sesión no válida" });
    }
    req.auth = claims;
    req.usuario = { id: rows[0].id, nombre: rows[0].nombre, tipo: rows[0].tipo };
    next();
  });
}
function permitirRoles(...roles) {
  return (req, res, next) => {
    if (!req.usuario) return res.status(401).json({ message: "Inicia sesión" });
    if (!roles.includes(req.usuario.tipo)) return res.status(403).json({ message: "No autorizado" });
    next();
  };
}
module.exports = { autenticar, permitirRoles };
