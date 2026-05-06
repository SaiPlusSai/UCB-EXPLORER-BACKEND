const pool = require("../../../config/database");

const listar = async ({
  soloActivos = false,
} = {}) => {

  const where = soloActivos
    ? "WHERE activo = TRUE"
    : "";

  const { rows } = await pool.query(
    `SELECT *
     FROM premios
     ${where}
     ORDER BY id DESC`
  );

  return rows;
};

const obtener = async (id) => {

  const { rows } = await pool.query(
    `SELECT *
     FROM premios
     WHERE id = $1`,
    [id]
  );

  return rows[0] || null;
};

const decrementarStock = async (
  id
) => {

  const { rows } = await pool.query(
    `UPDATE premios
     SET stock = stock - 1,
         actualizado_en = NOW()
     WHERE id = $1
     AND stock > 0
     RETURNING *`,
    [id]
  );

  return rows[0] || null;
};

module.exports = {
  listar,
  obtener,
  decrementarStock,
};