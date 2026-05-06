const qrModel = require("../models/qrModel");
const visitanteModel = require("../../ticket-access-visitor/models/visitanteModel");
const HttpError = require("../../../shared/utils/httpError");

const PUNTOS_QR_DEFAULT = 50;

const parsePuntos = (contenido) => {
  // Soporta formatos: "PUNTOS:100", "UCB:PUNTOS:100", o JSON {"puntos":100}
  try {
    if (contenido.startsWith("{")) {
      const obj = JSON.parse(contenido);
      if (obj && typeof obj.puntos === "number") return obj.puntos;
    }
  } catch (_) {}
  const m = contenido.match(/PUNTOS\s*[:=]\s*(\d{1,4})/i);
  if (m) return Number(m[1]);
  return PUNTOS_QR_DEFAULT;
};

const escanear = async (visitanteId, { contenido_qr }) => {
  if (!contenido_qr || !contenido_qr.trim())
    throw new HttpError(400, "contenido_qr requerido");
  const yaExiste = await qrModel.yaEscaneado(visitanteId, contenido_qr);
  if (yaExiste) throw new HttpError(409, "Este QR ya fue escaneado");

  const puntos = parsePuntos(contenido_qr);
  await qrModel.registrarEscaneo({
    visitante_id: visitanteId,
    contenido_qr,
    puntos_otorgados: puntos,
  });
  const visitante = await visitanteModel.sumarPuntos(visitanteId, puntos);
  return { puntos_otorgados: puntos, total_puntos: visitante.puntos_totales };
};

const historialVisitante = (visitanteId) =>
  qrModel.escaneosPorVisitante(visitanteId);

const todosEscaneosAdmin = () => qrModel.todosEscaneos();

module.exports = { escanear, historialVisitante, todosEscaneosAdmin };
