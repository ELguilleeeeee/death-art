const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");

const DOS_HORAS_MS = 2 * 60 * 60 * 1000;
function secreto() {
  const value = process.env.JWT_SECRET;
  if (typeof value !== "string" || value.length < 32) throw new Error("JWT_SECRET no configurado");
  return value;
}
function crearToken(usuarioId) {
  if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) throw new Error("Usuario inválido");
  const identificador = randomUUID();
  const expiracion = new Date(Date.now() + DOS_HORAS_MS);
  const token = jwt.sign({ sid: identificador }, secreto(), {
    subject: String(usuarioId), expiresIn: "2h", issuer: "death-art",
    audience: "death-art-web", algorithm: "HS256"
  });
  return { token, identificador, expiracion };
}
function verificarToken(token) {
  const claims = jwt.verify(token, secreto(), {
    algorithms: ["HS256"], issuer: "death-art", audience: "death-art-web"
  });
  const usuarioId = Number(claims.sub);
  if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0 ||
      typeof claims.sid !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(claims.sid)) {
    throw new Error("Token inválido");
  }
  return { usuarioId, identificador: claims.sid };
}
module.exports = { crearToken, verificarToken };
