const pool = require("../../../config/database");

const registrar = async ({
  visitante_id,
  pregunta_id,
  opcion_seleccionada_id,
  correcta,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO respuestas_trivia
       (visitante_id, pregunta_id, opcion_seleccionada_id, correcta)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [visitante_id, pregunta_id, opcion_seleccionada_id, correcta]
  );
  return rows[0];
};

const yaRespondio = async (visitante_id, pregunta_id) => {
  const { rows } = await pool.query(
    `SELECT id FROM respuestas_trivia
     WHERE visitante_id = $1 AND pregunta_id = $2`,
    [visitante_id, pregunta_id]
  );
  return rows.length > 0;
};

const respondidasPor = async (visitante_id) => {
  const { rows } = await pool.query(
    `SELECT r.*, p.pregunta, p.puntos
     FROM respuestas_trivia r
     JOIN preguntas_trivia p ON p.id = r.pregunta_id
     WHERE r.visitante_id = $1
     ORDER BY r.respondido_en DESC`,
    [visitante_id]
  );
  return rows;
};

module.exports = { registrar, yaRespondio, respondidasPor };
