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

const crear = async ({
  ticket_id,
  colegio_id,
  validacion_completada = true,
  email = null,
  nombre = null,
  telefono = null,
  ci = null,
  fecha_nacimiento = null,
  tipo_visitante = "estudiante",
  parentesco = null,
  nombre_estudiante = null,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO visitantes (
      ticket_id, colegio_id, validacion_completada,
      email, nombre, telefono, ci, fecha_nacimiento,
      tipo_visitante, parentesco, nombre_estudiante
    )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [
      ticket_id,
      colegio_id,
      validacion_completada,
      email,
      nombre,
      telefono,
      ci,
      fecha_nacimiento,
      tipo_visitante,
      parentesco,
      nombre_estudiante,
    ]
  );
  return rows[0];
};

const obtenerPorEmail = async (email) => {
  const { rows } = await pool.query(
    `SELECT v.*, c.nombre AS colegio_nombre
     FROM visitantes v
     LEFT JOIN colegios c ON c.id = v.colegio_id
     WHERE LOWER(v.email) = LOWER($1)
     ORDER BY v.creado_en DESC
     LIMIT 1`,
    [email]
  );
  return rows[0] || null;
};

const buscarPorCI = async (ci, fecha_nacimiento) => {
  const { rows } = await pool.query(
    `SELECT v.*, t.id AS ticket_id, t.codigo_ticket,
            c.nombre AS colegio_nombre
     FROM visitantes v
     JOIN tickets t ON t.id = v.ticket_id
     LEFT JOIN colegios c ON c.id = v.colegio_id
     WHERE v.ci = $1 AND v.fecha_nacimiento = $2
     ORDER BY v.creado_en DESC
     LIMIT 1`,
    [ci, fecha_nacimiento]
  );
  return rows[0] || null;
};

const actualizarDatos = async (id, { ci, fecha_nacimiento, nombre, email }) => {
  const sets = [];
  const params = [id];
  let idx = 2;

  if (ci !== undefined) {
    sets.push(`ci = $${idx++}`);
    params.push(ci);
  }
  if (fecha_nacimiento !== undefined) {
    sets.push(`fecha_nacimiento = $${idx++}`);
    params.push(fecha_nacimiento);
  }
  if (nombre !== undefined) {
    sets.push(`nombre = $${idx++}`);
    params.push(nombre);
  }
  if (email !== undefined) {
    sets.push(`email = $${idx++}`);
    params.push(email);
  }

  if (sets.length === 0) return null;

  sets.push("actualizado_en = NOW()");

  const { rows } = await pool.query(
    `UPDATE visitantes SET ${sets.join(", ")} WHERE id = $1 RETURNING *`,
    params
  );
  return rows[0] || null;
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
  obtenerPorEmail,
  buscarPorCI,
  actualizarDatos,
  sumarPuntos,
  restarPuntos,
  obtenerCarreras,
  reemplazarCarreras,
};
