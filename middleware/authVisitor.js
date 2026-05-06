const { verify } = require("../config/jwt");

const authVisitor = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ ok: false, error: "Token no proporcionado" });
  }
  try {
    const payload = verify(token);
    if (payload.tipo !== "visitante") {
      return res.status(403).json({ ok: false, error: "Acceso restringido a visitantes" });
    }
    req.visitante = payload;
    next();
  } catch (e) {
    return res.status(401).json({ ok: false, error: "Token invalido o expirado" });
  }
};

module.exports = authVisitor;
