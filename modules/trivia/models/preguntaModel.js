const pool = require("../../../config/database");

const listar = async ({ carrera_id, soloActivas = false } = {}) => {
  const conds = [];
  const params = [];
  if (carrera_id) {
    params.push(carrera_id);
    conds.push(`p.carrera_id = $${params.length}`);
  }
  if (soloActivas) conds.push(`p.activa = TRUE`);
  const where = conds.length ? `WHERE ${conds.join(" AND ")}` : "";
  const { rows } = await pool.query(
    `SELECT p.*, c.nombre AS carrera_nombre
     FROM preguntas_trivia p
     LEFT JOIN carreras c ON c.id = p.carrera_id
     ${where}
     ORDER BY p.id DESC`,
    params
  );
  return rows;
};

const obtener = async (id) => {
  const { rows } = await pool.query(
    `SELECT * FROM preguntas_trivia WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
};

const obtenerConOpciones = async (id) => {
  const pregunta = await obtener(id);
  if (!pregunta) return null;
  const { rows } = await pool.query(
    `SELECT id, texto_opcion, es_correcta
     FROM opciones_trivia WHERE pregunta_id = $1
     ORDER BY id ASC`,
    [id]
  );
  return { ...pregunta, opciones: rows };
};

const listarConOpciones = async (filtros = {}) => {
  const preguntas = await listar(filtros);
  if (preguntas.length === 0) return [];
  const ids = preguntas.map((p) => p.id);
  const { rows: opciones } = await pool.query(
    `SELECT id, pregunta_id, texto_opcion, es_correcta
     FROM opciones_trivia
     WHERE pregunta_id = ANY($1::int[])
     ORDER BY id ASC`,
    [ids]
  );
  const map = new Map(preguntas.map((p) => [p.id, { ...p, opciones: [] }]));
  for (const op of opciones) {
    const pre = map.get(op.pregunta_id);
    if (pre) pre.opciones.push(op);
  }
  return Array.from(map.values());
};

const crear = async ({
  carrera_id,
  pregunta,
  tipo_pregunta,
  puntos,
  mensaje_feedback,
  activa = true,
  creado_por_admin_id,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO preguntas_trivia
       (carrera_id, pregunta, tipo_pregunta, puntos, mensaje_feedback, activa, creado_por_admin_id)
     VALUES ($1, $2, COALESCE($3,'multiple'), COALESCE($4,100), $5, $6, $7)
     RETURNING *`,
    [
      carrera_id || null,
      pregunta,
      tipo_pregunta,
      puntos,
      mensaje_feedback || null,
      activa,
      creado_por_admin_id,
    ]
  );
  return rows[0];
};

const actualizar = async (
  id,
  { carrera_id, pregunta, tipo_pregunta, puntos, mensaje_feedback, activa }
) => {
  const { rows } = await pool.query(
    `UPDATE preguntas_trivia
     SET carrera_id = COALESCE($2, carrera_id),
         pregunta = COALESCE($3, pregunta),
         tipo_pregunta = COALESCE($4, tipo_pregunta),
         puntos = COALESCE($5, puntos),
         mensaje_feedback = COALESCE($6, mensaje_feedback),
         activa = COALESCE($7, activa),
         actualizado_en = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, carrera_id, pregunta, tipo_pregunta, puntos, mensaje_feedback, activa]
  );
  return rows[0] || null;
};

const eliminar = async (id) => {
  await pool.query(`DELETE FROM preguntas_trivia WHERE id = $1`, [id]);
};

const reemplazarOpciones = async (preguntaId, opciones) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`DELETE FROM opciones_trivia WHERE pregunta_id = $1`, [
      preguntaId,
    ]);
    for (const op of opciones) {
      await client.query(
        `INSERT INTO opciones_trivia (pregunta_id, texto_opcion, es_correcta)
         VALUES ($1, $2, $3)`,
        [preguntaId, op.texto_opcion, !!op.es_correcta]
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

const opcionPertenece = async (opcion_id, pregunta_id) => {
  const { rows } = await pool.query(
    `SELECT id, es_correcta FROM opciones_trivia WHERE id = $1 AND pregunta_id = $2`,
    [opcion_id, pregunta_id]
  );
  return rows[0] || null;
};

module.exports = {
  listar,
  obtener,
  obtenerConOpciones,
  listarConOpciones,
  crear,
  actualizar,
  eliminar,
  reemplazarOpciones,
  opcionPertenece,
};
