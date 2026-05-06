const pool = require("../../../config/database");

const obtener = async (id) => {
  const { rows } = await pool.query(
    `SELECT v.*, c.nombre AS colegio_nombre
     FROM visitantes v
     LEFT JOIN colegios c ON c.id = v.colegio_id
     WHERE v.id = $1`,
    [id]
  );
  return rows[0] || null;
};

const obtenerPorTicket = async (ticketId) => {
  const { rows } = await pool.query(
    `SELECT * FROM visitantes WHERE ticket_id = $1`,
    [ticketId]
  );
  return rows[0] || null;
};

const crear = async ({ ticket_id, colegio_id, validacion_completada = true }) => {
  const { rows } = await pool.query(
    `INSERT INTO visitantes (ticket_id, colegio_id, validacion_completada)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [ticket_id, colegio_id, validacion_completada]
  );
  return rows[0];
};

const sumarPuntos = async (visitante_id, puntos) => {
  const { rows } = await pool.query(
    `UPDATE visitantes
     SET puntos_totales = puntos_totales + $2,
         actualizado_en = NOW()
     WHERE id = $1
     RETURNING *`,
    [visitante_id, puntos]
  );
  return rows[0];
};

const restarPuntos = async (visitante_id, puntos) => {
  const { rows } = await pool.query(
    `UPDATE visitantes
     SET puntos_totales = GREATEST(puntos_totales - $2, 0),
         actualizado_en = NOW()
     WHERE id = $1
     RETURNING *`,
    [visitante_id, puntos]
  );
  return rows[0];
};

const obtenerCarreras = async (visitanteId) => {
  const { rows } = await pool.query(
    `SELECT vc.id, vc.prioridad, c.id AS carrera_id, c.nombre, c.descripcion
     FROM visitante_carreras vc
     JOIN carreras c ON c.id = vc.carrera_id
     WHERE vc.visitante_id = $1
     ORDER BY vc.prioridad ASC`,
    [visitanteId]
  );
  return rows;
};

const reemplazarCarreras = async (visitanteId, carreras) => {
  const client = await require("../../../config/database").connect();
  try {
    await client.query("BEGIN");
    await client.query(`DELETE FROM visitante_carreras WHERE visitante_id = $1`, [visitanteId]);
    for (const c of carreras) {
      await client.query(
        `INSERT INTO visitante_carreras (visitante_id, carrera_id, prioridad)
         VALUES ($1, $2, $3)`,
        [visitanteId, c.carrera_id, c.prioridad]
      );
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

module.exports = {
  obtener,
  obtenerPorTicket,
  crear,
  sumarPuntos,
  restarPuntos,
  obtenerCarreras,
  reemplazarCarreras,
};
