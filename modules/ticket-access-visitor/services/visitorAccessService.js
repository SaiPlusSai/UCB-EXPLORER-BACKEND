const colegioModel = require("../models/colegioModel");
const ticketModel = require("../models/ticketModel");
const visitanteModel = require("../models/visitanteModel");
const carreraModel = require("../../career/models/carreraModel");
const HttpError = require("../../../shared/utils/httpError");
const { sign } = require("../../../config/jwt");

const generarCodigoTicket = () =>
  `OH-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase()}`;

const accesoSimplificado = async ({ colegio, colegio_id, carreras }) => {
  if (!Array.isArray(carreras) || carreras.length === 0)
    throw new HttpError(400, "Debe seleccionar entre 1 y 3 carreras");
  if (carreras.length > 3) throw new HttpError(400, "Maximo 3 carreras");

  let colegioRow = null;
  if (colegio_id) {
    colegioRow = await colegioModel.obtener(colegio_id);
    if (!colegioRow) throw new HttpError(404, "Colegio no encontrado");
  } else if (colegio && colegio.trim()) {
    colegioRow = await colegioModel.buscarOCrearPorNombre(colegio.trim());
  } else {
    throw new HttpError(400, "Debe indicar colegio o colegio_id");
  }

  for (const c of carreras) {
    const carrera = await carreraModel.obtener(c.carrera_id);
    if (!carrera || !carrera.activa)
      throw new HttpError(400, `Carrera ${c.carrera_id} no esta disponible`);
  }

  const ticket = await ticketModel.crearTicket({
    codigo_ticket: generarCodigoTicket(),
    datos_externos: { fase: "preliminar" },
    validado: true,
  });

  const visitante = await visitanteModel.crear({
    ticket_id: ticket.id,
    colegio_id: colegioRow.id,
    validacion_completada: true,
  });

  const carrerasNormalizadas = carreras.map((c, idx) => ({
    carrera_id: c.carrera_id,
    prioridad: c.prioridad || idx + 1,
  }));
  await visitanteModel.reemplazarCarreras(visitante.id, carrerasNormalizadas);

  const token = sign({
    id: visitante.id,
    ticket_id: ticket.id,
    tipo: "visitante",
  });

  return {
    token,
    visitante: {
      id: visitante.id,
      ticket_id: ticket.id,
      colegio: colegioRow,
      puntos_totales: 0,
    },
  };
};

const obtenerPerfil = async (visitanteId) => {
  const visitante = await visitanteModel.obtener(visitanteId);
  if (!visitante) throw new HttpError(404, "Visitante no encontrado");
  const carreras = await visitanteModel.obtenerCarreras(visitanteId);
  return { ...visitante, carreras };
};

module.exports = { accesoSimplificado, obtenerPerfil };
