const pool = require("../../../config/database");

const findByCorreo = async (correo) => {
  const { rows } = await pool.query(
    `SELECT id, correo, password_hash, rol, activo
     FROM administradores
     WHERE correo = $1`,
    [correo]
  );
  return rows[0] || null;
};

const findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT id, correo, rol, activo, creado_en, actualizado_en
     FROM administradores WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
};

const listar = async () => {
  const { rows } = await pool.query(
    `SELECT id, correo, rol, activo, creado_en, actualizado_en
     FROM administradores
     ORDER BY id ASC`
  );
  return rows;
};

const crear = async ({ correo, password_hash, rol = "ADMIN" }) => {
  const { rows } = await pool.query(
    `INSERT INTO administradores (correo, password_hash, rol)
     VALUES ($1, $2, $3)
     RETURNING id, correo, rol, activo, creado_en`,
    [correo, password_hash, rol]
  );
  return rows[0];
};

const actualizar = async (id, { correo, rol, activo }) => {
  const { rows } = await pool.query(
    `UPDATE administradores
     SET correo = COALESCE($2, correo),
         rol = COALESCE($3, rol),
         activo = COALESCE($4, activo),
         actualizado_en = NOW()
     WHERE id = $1
     RETURNING id, correo, rol, activo`,
    [id, correo, rol, activo]
  );
  return rows[0] || null;
};

const cambiarPassword = async (id, password_hash) => {
  await pool.query(
    `UPDATE administradores
     SET password_hash = $2, actualizado_en = NOW()
     WHERE id = $1`,
    [id, password_hash]
  );
};

const eliminar = async (id) => {
  await pool.query(`DELETE FROM administradores WHERE id = $1`, [id]);
};

module.exports = {
  findByCorreo,
  findById,
  listar,
  crear,
  actualizar,
  cambiarPassword,
  eliminar,
};
