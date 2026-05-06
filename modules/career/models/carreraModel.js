const pool = require("../../../config/database");

const listar = async ({ soloActivas = false } = {}) => {
  const where = soloActivas ? "WHERE activa = TRUE" : "";
  const { rows } = await pool.query(
    `SELECT id, nombre, descripcion, activa, creado_por_admin_id, creado_en, actualizado_en
     FROM carreras ${where}
     ORDER BY nombre ASC`
  );
  return rows;
};

const obtener = async (id) => {
  const { rows } = await pool.query(
    `SELECT id, nombre, descripcion, activa, creado_por_admin_id, creado_en, actualizado_en
     FROM carreras WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
};

const crear = async ({ nombre, descripcion, creado_por_admin_id }) => {
  const { rows } = await pool.query(
    `INSERT INTO carreras (nombre, descripcion, creado_por_admin_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [nombre, descripcion, creado_por_admin_id]
  );
  return rows[0];
};

const actualizar = async (id, { nombre, descripcion, activa }) => {
  const { rows } = await pool.query(
    `UPDATE carreras
     SET nombre = COALESCE($2, nombre),
         descripcion = COALESCE($3, descripcion),
         activa = COALESCE($4, activa),
         actualizado_en = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, nombre, descripcion, activa]
  );
  return rows[0] || null;
};

const eliminar = async (id) => {
  await pool.query(`DELETE FROM carreras WHERE id = $1`, [id]);
};

module.exports = { listar, obtener, crear, actualizar, eliminar };
