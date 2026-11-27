
const jwt = require("jsonwebtoken");

const DURACION_TOKEN = "2h";
const EMISOR = "death-art";
const AUDIENCIA = "death-art-web";

function obtenerSecreto() {
  const secreto = process.env.JWT_SECRET;

  if (!secreto || secreto.length < 32) {
    throw new Error(
      "JWT_SECRET debe configurarse con al menos 32 caracteres."
    );
  }

  return secreto;
}

function crearToken(usuarioId) {
  if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) {
    throw new Error("ID de usuario inválido");
  }

  return jwt.sign(
    {},
    obtenerSecreto(),
    {
      subject: String(usuarioId),
      expiresIn: DURACION_TOKEN,
      issuer: EMISOR,
      audience: AUDIENCIA,
      algorithm: "HS256"
    }
  );
}

function verificarToken(token) {
  const datos = jwt.verify(
    token,
    obtenerSecreto(),
    {
      algorithms: ["HS256"],
      issuer: EMISOR,
      audience: AUDIENCIA
    }
  );

  const usuarioId = Number(datos.sub);

  if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) {
    throw new Error("Token con usuario inválido");
  }

  return usuarioId;
}

module.exports = {
  crearToken,
  verificarToken
};
