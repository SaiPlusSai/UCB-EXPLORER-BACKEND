const pool = require("../../../config/database");

const listarPreguntas = async ({
  soloActivas = false,
} = {}) => {

  const where = soloActivas
    ? "WHERE activa = TRUE"
    : "";

  const { rows } = await pool.query(
    `SELECT *
     FROM preguntas_feedback
     ${where}
     ORDER BY id DESC`
  );

  return rows;
};

const obtenerPregunta = async (
  id
) => {

  const { rows } = await pool.query(
    `SELECT *
     FROM preguntas_feedback
     WHERE id = $1`,
    [id]
  );

  return rows[0] || null;
};

const registrarRespuesta = async ({
  visitante_id,
  pregunta_id,
  valor_rating,
  respuesta_texto,
}) => {

  const { rows } = await pool.query(
    `INSERT INTO respuestas_feedback
      (
        visitante_id,
        pregunta_id,
        valor_rating,
        respuesta_texto
      )
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [
      visitante_id,
      pregunta_id,
      valor_rating || null,
      respuesta_texto || null,
    ]
  );

  return rows[0];
};

module.exports = {
  listarPreguntas,
  obtenerPregunta,
  registrarRespuesta,
};