
const { verificarToken } = require("./authTokens");

function autenticar(req, res, next) {
  const autorizacion = req.headers.authorization;

  if (
    typeof autorizacion !== "string" ||
    !autorizacion.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      message: "Debes iniciar sesión."
    });
  }

  const token = autorizacion.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      message: "Token de autenticación faltante."
    });
  }

  try {
    const usuarioId = verificarToken(token);

    req.auth = {
      usuarioId
    };

    next();

  } catch {
    return res.status(401).json({
      message: "Sesión inválida o expirada."
    });
  }
}

module.exports = {
  autenticar
};
