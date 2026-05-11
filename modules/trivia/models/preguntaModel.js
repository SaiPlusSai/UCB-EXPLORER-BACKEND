const pool = require("../../../config/database");

const listar = async ({
  carrera_id,
  carreras_ids,
  soloActivas = false,
} = {}) => {

  const conds = [];

  const params = [];

  if (carrera_id) {

    params.push(carrera_id);

    conds.push(
      `p.carrera_id = $${params.length}`
    );
  }

  if (
    Array.isArray(carreras_ids) &&
    carreras_ids.length > 0
  ) {

    params.push(carreras_ids);

    conds.push(`
      (
        p.carrera_id = ANY($${params.length}::int[])
        OR p.carrera_id IS NULL
      )
    `);
  }

  if (soloActivas) {

    conds.push(`p.activa = TRUE`);
  }

  const where = conds.length
    ? `WHERE ${conds.join(" AND ")}`
    : "";

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
    `SELECT * FROM preguntas_trivia
     WHERE id = $1`,
    [id]
  );

  return rows[0] || null;
};

const listarConOpciones = async (
  filtros = {}
) => {

  const preguntas = await listar(filtros);

  if (preguntas.length === 0) return [];

  const ids = preguntas.map((p) => p.id);

  const { rows: opciones } = await pool.query(
    `SELECT
        id,
        pregunta_id,
        texto_opcion,
        es_correcta
     FROM opciones_trivia
     WHERE pregunta_id = ANY($1::int[])
     ORDER BY id ASC`,
    [ids]
  );

  const map = new Map(
    preguntas.map((p) => [
      p.id,
      {
        ...p,
        opciones: [],
      },
    ])
  );

  for (const op of opciones) {

    const pre = map.get(op.pregunta_id);

    if (pre) {

      pre.opciones.push(op);
    }
  }

  return Array.from(map.values());
};

const opcionPertenece = async (
  opcion_id,
  pregunta_id
) => {

  const { rows } = await pool.query(
    `SELECT id, es_correcta
     FROM opciones_trivia
     WHERE id = $1
     AND pregunta_id = $2`,
    [opcion_id, pregunta_id]
  );

  return rows[0] || null;
};

const crear = async ({
  pregunta,
  carrera_id,
  puntos,
  mensaje_feedback,
  activa,
}) => {

  const { rows } = await pool.query(
    `INSERT INTO preguntas_trivia
       (pregunta, carrera_id, puntos, mensaje_feedback, activa)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      pregunta,
      carrera_id || null,
      puntos ?? 0,
      mensaje_feedback || null,
      activa ?? true,
    ]
  );

  return rows[0];
};

const actualizar = async (
  id,
  { pregunta, carrera_id, puntos, mensaje_feedback, activa }
) => {

  const { rows } = await pool.query(
    `UPDATE preguntas_trivia
     SET pregunta          = COALESCE($2, pregunta),
         carrera_id        = $3,
         puntos            = COALESCE($4, puntos),
         mensaje_feedback  = $5,
         activa            = COALESCE($6, activa)
     WHERE id = $1
     RETURNING *`,
    [
      id,
      pregunta,
      carrera_id !== undefined ? carrera_id || null : undefined,
      puntos,
      mensaje_feedback !== undefined ? mensaje_feedback || null : undefined,
      activa,
    ]
  );

  return rows[0] || null;
};

const eliminar = async (id) => {

  await pool.query(
    `DELETE FROM preguntas_trivia WHERE id = $1`,
    [id]
  );
};

const reemplazarOpciones = async (
  pregunta_id,
  opciones
) => {

  await pool.query(
    `DELETE FROM opciones_trivia WHERE pregunta_id = $1`,
    [pregunta_id]
  );

  if (!opciones || opciones.length === 0) return [];

  const values = opciones
    .map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`)
    .join(', ');

  const params = opciones.flatMap((o) => [
    pregunta_id,
    o.texto_opcion,
    !!o.es_correcta,
  ]);

  const { rows } = await pool.query(
    `INSERT INTO opciones_trivia (pregunta_id, texto_opcion, es_correcta)
     VALUES ${values}
     RETURNING *`,
    params
  );

  return rows;
};

const obtenerConOpciones = async (id) => {

  const p = await obtener(id);

  if (!p) return null;

  const { rows: opciones } = await pool.query(
    `SELECT id, pregunta_id, texto_opcion, es_correcta
     FROM opciones_trivia
     WHERE pregunta_id = $1
     ORDER BY id ASC`,
    [id]
  );

  return { ...p, opciones };
};

module.exports = {
  listar,
  obtener,
  listarConOpciones,
  opcionPertenece,
  crear,
  actualizar,
  eliminar,
  reemplazarOpciones,
  obtenerConOpciones,
};