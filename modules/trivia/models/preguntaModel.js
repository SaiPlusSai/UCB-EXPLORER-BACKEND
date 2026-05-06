const pool = require("../../../config/database");

const listar = async ({
  carrera_id,
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

module.exports = {
  listar,
  obtener,
  listarConOpciones,
  opcionPertenece,
};