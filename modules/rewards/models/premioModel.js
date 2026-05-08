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

const crear = async ({
  nombre,
  descripcion,
  imagen_url,
  costo_puntos,
  stock,
  activo,
}) => {

  const { rows } = await pool.query(
    `INSERT INTO premios
       (nombre, descripcion, imagen_url, costo_puntos, stock, activo)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      nombre,
      descripcion || null,
      imagen_url || null,
      costo_puntos ?? 0,
      stock ?? 0,
      activo ?? true,
    ]
  );

  return rows[0];
};

const actualizar = async (
  id,
  { nombre, descripcion, imagen_url, costo_puntos, stock, activo }
) => {

  const { rows } = await pool.query(
    `UPDATE premios
     SET nombre       = COALESCE($2, nombre),
         descripcion  = $3,
         imagen_url   = $4,
         costo_puntos = COALESCE($5, costo_puntos),
         stock        = COALESCE($6, stock),
         activo       = COALESCE($7, activo),
         actualizado_en = NOW()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      nombre,
      descripcion !== undefined ? descripcion || null : undefined,
      imagen_url !== undefined ? imagen_url || null : undefined,
      costo_puntos,
      stock,
      activo,
    ]
  );

  return rows[0] || null;
};

const eliminar = async (id) => {

  await pool.query(
    `DELETE FROM premios WHERE id = $1`,
    [id]
  );
};

module.exports = {
  listar,
  obtener,
  decrementarStock,
  crear,
  actualizar,
  eliminar,
};