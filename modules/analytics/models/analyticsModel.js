const pool = require("../../../config/database");

const registrarEvento = async ({ visitante_id, tipo_evento, payload, origen }) => {
  const { rows } = await pool.query(
    `INSERT INTO eventos_sistema (visitante_id, tipo_evento, payload, origen)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [visitante_id || null, tipo_evento, payload || null, origen || null]
  );
  return rows[0];
};

const resumen = async () => {
  const { rows } = await pool.query(
    `SELECT
      (SELECT COUNT(*) FROM visitantes) AS total_visitantes,
      (SELECT COUNT(*) FROM tickets) AS total_tickets,
      (SELECT COUNT(*) FROM respuestas_trivia) AS total_respuestas_trivia,
      (SELECT COUNT(*) FROM respuestas_trivia WHERE correcta = TRUE) AS trivia_correctas,
      (SELECT COUNT(*) FROM canjes_premios) AS total_canjes,
      (SELECT COUNT(*) FROM escaneos_qr) AS total_escaneos,
      (SELECT COUNT(*) FROM respuestas_feedback) AS total_feedback,
      (SELECT COUNT(*) FROM carreras WHERE activa = TRUE) AS carreras_activas,
      (SELECT COUNT(*) FROM premios WHERE activo = TRUE) AS premios_activos`
  );
  return rows[0];
};

const visitantesPorColegio = async () => {
  const { rows } = await pool.query(
    `SELECT c.id, c.nombre, COUNT(v.id) AS visitantes
     FROM colegios c
     LEFT JOIN visitantes v ON v.colegio_id = c.id
     GROUP BY c.id, c.nombre
     ORDER BY visitantes DESC
     LIMIT 30`
  );
  return rows;
};

const carrerasMasElegidas = async () => {
  const { rows } = await pool.query(
    `SELECT c.id, c.nombre,
            COUNT(vc.id) AS elecciones,
            COUNT(*) FILTER (WHERE vc.prioridad = 1) AS prioridad_1
     FROM carreras c
     LEFT JOIN visitante_carreras vc ON vc.carrera_id = c.id
     GROUP BY c.id, c.nombre
     ORDER BY elecciones DESC
     LIMIT 30`
  );
  return rows;
};

const topVisitantes = async () => {
  const { rows } = await pool.query(
    `SELECT v.id, v.puntos_totales, v.creado_en, c.nombre AS colegio
     FROM visitantes v
     LEFT JOIN colegios c ON c.id = v.colegio_id
     ORDER BY v.puntos_totales DESC
     LIMIT 20`
  );
  return rows;
};

module.exports = {
  registrarEvento,
  resumen,
  visitantesPorColegio,
  carrerasMasElegidas,
  topVisitantes,
};
