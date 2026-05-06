const pool = require("../../../config/database");

const listar = async () => {
  const { rows } = await pool.query(
    `SELECT id, nombre, creado_por_admin_id, creado_en
     FROM colegios
     ORDER BY nombre ASC`
  );
  return rows;
};

const obtener = async (id) => {
  const { rows } = await pool.query(
    `SELECT * FROM colegios WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
};

const buscarOCrearPorNombre = async (nombre, adminId = null) => {
  const limpio = nombre.trim();
  const existing = await pool.query(
    `SELECT * FROM colegios WHERE LOWER(nombre) = LOWER($1)`,
    [limpio]
  );
  if (existing.rows[0]) return existing.rows[0];
  const { rows } = await pool.query(
    `INSERT INTO colegios (nombre, creado_por_admin_id) VALUES ($1, $2) RETURNING *`,
    [limpio, adminId]
  );
  return rows[0];
};

const crear = async ({ nombre, adminId }) => {
  const { rows } = await pool.query(
    `INSERT INTO colegios (nombre, creado_por_admin_id) VALUES ($1, $2) RETURNING *`,
    [nombre.trim(), adminId]
  );
  return rows[0];
};

const actualizar = async (id, { nombre }) => {
  const { rows } = await pool.query(
    `UPDATE colegios SET nombre = COALESCE($2, nombre) WHERE id = $1 RETURNING *`,
    [id, nombre]
  );
  return rows[0] || null;
};

const eliminar = async (id) => {
  await pool.query(`DELETE FROM colegios WHERE id = $1`, [id]);
};

module.exports = { listar, obtener, buscarOCrearPorNombre, crear, actualizar, eliminar };
