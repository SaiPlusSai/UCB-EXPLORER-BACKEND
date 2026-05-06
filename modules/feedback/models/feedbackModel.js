const pool = require("../../../config/database");

const listarPreguntas = async ({ soloActivas = false } = {}) => {
  const where = soloActivas ? "WHERE activa = TRUE" : "";
  const { rows } = await pool.query(
    `SELECT * FROM preguntas_feedback ${where} ORDER BY id DESC`
  );
  return rows;
};

const obtenerPregunta = async (id) => {
  const { rows } = await pool.query(
    `SELECT * FROM preguntas_feedback WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
};

const crearPregunta = async ({
  pregunta,
  tipo_pregunta,
  categoria,
  activa = true,
  creado_por_admin_id,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO preguntas_feedback (pregunta, tipo_pregunta, categoria, activa, creado_por_admin_id)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [pregunta, tipo_pregunta, categoria || null, activa, creado_por_admin_id]
  );
  return rows[0];
};

const actualizarPregunta = async (
  id,
  { pregunta, tipo_pregunta, categoria, activa }
) => {
  const { rows } = await pool.query(
    `UPDATE preguntas_feedback
     SET pregunta = COALESCE($2, pregunta),
         tipo_pregunta = COALESCE($3, tipo_pregunta),
         categoria = COALESCE($4, categoria),
         activa = COALESCE($5, activa),
         actualizado_en = NOW()
     WHERE id = $1 RETURNING *`,
    [id, pregunta, tipo_pregunta, categoria, activa]
  );
  return rows[0] || null;
};

const eliminarPregunta = async (id) => {
  await pool.query(`DELETE FROM preguntas_feedback WHERE id = $1`, [id]);
};

const registrarRespuesta = async ({
  visitante_id,
  pregunta_id,
  valor_rating,
  respuesta_texto,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO respuestas_feedback (visitante_id, pregunta_id, valor_rating, respuesta_texto)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [visitante_id, pregunta_id, valor_rating || null, respuesta_texto || null]
  );
  return rows[0];
};

const respuestasPorPregunta = async (pregunta_id) => {
  const { rows } = await pool.query(
    `SELECT rf.*, v.id AS visitante
     FROM respuestas_feedback rf
     LEFT JOIN visitantes v ON v.id = rf.visitante_id
     WHERE rf.pregunta_id = $1
     ORDER BY rf.respondido_en DESC`,
    [pregunta_id]
  );
  return rows;
};

const todasLasRespuestas = async () => {
  const { rows } = await pool.query(
    `SELECT rf.*, pf.pregunta, pf.tipo_pregunta, pf.categoria
     FROM respuestas_feedback rf
     JOIN preguntas_feedback pf ON pf.id = rf.pregunta_id
     ORDER BY rf.respondido_en DESC
     LIMIT 500`
  );
  return rows;
};

module.exports = {
  listarPreguntas,
  obtenerPregunta,
  crearPregunta,
  actualizarPregunta,
  eliminarPregunta,
  registrarRespuesta,
  respuestasPorPregunta,
  todasLasRespuestas,
};
