const errorHandler = (err, req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || "Error interno del servidor";
  if (process.env.NODE_ENV !== "production") {
    console.error("[ERROR]", err);
  }
  res.status(status).json({ ok: false, error: message });
};

module.exports = errorHandler;
