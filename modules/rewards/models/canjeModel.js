const pool = require("../../../config/database");

const registrar = async ({
  visitante_id,
  premio_id,
}) => {

  const { rows } = await pool.query(
    `INSERT INTO canjes_premios
       (visitante_id, premio_id)
     VALUES ($1, $2)
     RETURNING *`,
    [visitante_id, premio_id]
  );

  return rows[0];
};

const porVisitante = async (
  visitante_id
) => {

  const { rows } = await pool.query(
    `SELECT
        cp.*,
        p.nombre,
        p.imagen_url,
        p.costo_puntos
     FROM canjes_premios cp
     JOIN premios p
       ON p.id = cp.premio_id
     WHERE cp.visitante_id = $1
     ORDER BY cp.canjeado_en DESC`,
    [visitante_id]
  );

  return rows;
};

const todos = async () => {

  const { rows } = await pool.query(
    `SELECT
        cp.id,
        cp.canjeado_en,
        cp.visitante_id,
        cp.premio_id,
        p.nombre AS premio_nombre,
        p.costo_puntos,
        p.imagen_url
     FROM canjes_premios cp
     JOIN premios p ON p.id = cp.premio_id
     ORDER BY cp.canjeado_en DESC
     LIMIT 500`
  );

  return rows;
};

module.exports = {
  registrar,
  porVisitante,
  todos,
};