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

const accesoFamiliar = async ({
  nombre,
  email,
  telefono,
  parentesco,
  nombre_estudiante,
  colegio,
  colegio_id,
  carreras,
}) => {
  if (!nombre || !nombre.trim())
    throw new HttpError(400, "El nombre es obligatorio");
  if (!telefono || !telefono.trim())
    throw new HttpError(400, "El número de contacto es obligatorio");

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
    datos_externos: {
      fase: "preliminar",
      tipo: "familiar",
      parentesco: parentesco || null,
      nombre_estudiante: nombre_estudiante || null,
    },
    validado: true,
  });

  const visitante = await visitanteModel.crear({
    ticket_id: ticket.id,
    colegio_id: colegioRow.id,
    validacion_completada: true,
    nombre: nombre.trim(),
    email: email ? email.trim() : null,
    telefono: telefono.trim(),
    tipo_visitante: "familiar",
    parentesco: parentesco || null,
    nombre_estudiante: nombre_estudiante ? nombre_estudiante.trim() : null,
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
      nombre: nombre.trim(),
      tipo_visitante: "familiar",
      colegio: colegioRow,
      puntos_totales: 0,
    },
  };
};

const accesoGoogle = async ({ credential, access_token, colegio, colegio_id, carreras }) => {
  let email;
  let nombre;

  if (access_token) {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      if (!response.ok) throw new Error("Token failed validation");
      const data = await response.json();
      email = data.email;
      nombre = data.name || data.given_name || email;
    } catch (err) {
      throw new HttpError(400, "Token de Google inválido o expirado");
    }
  } else if (credential) {
    try {
      const parts = credential.split(".");
      if (parts.length !== 3) throw new Error("Invalid token format");
      const decoded = Buffer.from(parts[1], "base64").toString("utf8");
      const payload = JSON.parse(decoded);
      email = payload.email;
      nombre = payload.name || payload.given_name || email;
    } catch {
      throw new HttpError(400, "Token de Google inválido");
    }
  } else {
    throw new HttpError(400, "Se requiere access_token de Google");
  }

  if (!email) throw new HttpError(400, "No se pudo obtener el email de Google");

  // Check if visitor with this email already exists
  const existente = await visitanteModel.obtenerPorEmail(email);
  if (existente) {
    const token = sign({
      id: existente.id,
      ticket_id: existente.ticket_id,
      tipo: "visitante",
    });
    const carreras = await visitanteModel.obtenerCarreras(existente.id);
    return {
      token,
      visitante: {
        id: existente.id,
        ticket_id: existente.ticket_id,
        nombre: existente.nombre,
        email: existente.email,
        puntos_totales: existente.puntos_totales,
        carreras,
      },
    };
  }

  // New Google user — needs colegio + carreras
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
    datos_externos: { fase: "preliminar", auth: "google" },
    validado: true,
  });

  const visitante = await visitanteModel.crear({
    ticket_id: ticket.id,
    colegio_id: colegioRow.id,
    validacion_completada: true,
    email,
    nombre,
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
      nombre,
      email,
      colegio: colegioRow,
      puntos_totales: 0,
    },
  };
};

const buscarTicketPorDatos = async (visitanteId, { ci, fecha_nacimiento }) => {
  if (!ci || !fecha_nacimiento)
    throw new HttpError(400, "Debe proporcionar CI y fecha de nacimiento");

  // Save the CI/birthday to the current visitor
  await visitanteModel.actualizarDatos(visitanteId, { ci, fecha_nacimiento });

  // Look up any visitor with matching CI + birthday
  const resultado = await visitanteModel.buscarPorCI(ci, fecha_nacimiento);

  if (!resultado) {
    throw new HttpError(
      404,
      "No se encontró un ticket con esos datos. Verifica tu carnet y fecha de nacimiento."
    );
  }

  return {
    nombre: resultado.nombre || "Visitante",
    ticket_id: resultado.ticket_id,
    codigo_ticket: resultado.codigo_ticket,
    colegio: resultado.colegio_nombre,
    ci: resultado.ci,
  };
};

const obtenerPerfil = async (visitanteId) => {
  const visitante = await visitanteModel.obtener(visitanteId);
  if (!visitante) throw new HttpError(404, "Visitante no encontrado");
  const carreras = await visitanteModel.obtenerCarreras(visitanteId);
  return { ...visitante, carreras };
};

module.exports = {
  accesoSimplificado,
  accesoFamiliar,
  accesoGoogle,
  buscarTicketPorDatos,
  obtenerPerfil,
};
