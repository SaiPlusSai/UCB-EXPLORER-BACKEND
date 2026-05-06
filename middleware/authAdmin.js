const { verify } = require("../config/jwt");

const authAdmin = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ ok: false, error: "Token no proporcionado" });
  }
  try {
    const payload = verify(token);
    if (payload.tipo !== "admin") {
      return res.status(403).json({ ok: false, error: "Acceso restringido a administradores" });
    }
    req.admin = payload;
    next();
  } catch (e) {
    return res.status(401).json({ ok: false, error: "Token invalido o expirado" });
  }
};

module.exports = authAdmin;
