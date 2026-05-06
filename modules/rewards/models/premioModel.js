const pool = require("../../../config/database");

const listar = async ({ soloActivos = false } = {}) => {
  const where = soloActivos ? "WHERE activo = TRUE" : "";
  const { rows } = await pool.query(
    `SELECT * FROM premios ${where} ORDER BY id DESC`
  );
  return rows;
};

const obtener = async (id) => {
  const { rows } = await pool.query(`SELECT * FROM premios WHERE id = $1`, [id]);
  return rows[0] || null;
};

const crear = async ({
  nombre,
  descripcion,
  imagen_url,
  costo_puntos,
  stock = 0,
  activo = true,
  creado_por_admin_id,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO premios (nombre, descripcion, imagen_url, costo_puntos, stock, activo, creado_por_admin_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [
      nombre,
      descripcion || null,
      imagen_url || null,
      costo_puntos,
      stock,
      activo,
      creado_por_admin_id,
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
     SET nombre = COALESCE($2, nombre),
         descripcion = COALESCE($3, descripcion),
         imagen_url = COALESCE($4, imagen_url),
         costo_puntos = COALESCE($5, costo_puntos),
         stock = COALESCE($6, stock),
         activo = COALESCE($7, activo),
         actualizado_en = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, nombre, descripcion, imagen_url, costo_puntos, stock, activo]
  );
  return rows[0] || null;
};

const eliminar = async (id) => {
  await pool.query(`DELETE FROM premios WHERE id = $1`, [id]);
};

const decrementarStock = async (id) => {
  const { rows } = await pool.query(
    `UPDATE premios SET stock = stock - 1, actualizado_en = NOW()
     WHERE id = $1 AND stock > 0 RETURNING *`,
    [id]
  );
  return rows[0] || null;
};

module.exports = { listar, obtener, crear, actualizar, eliminar, decrementarStock };
