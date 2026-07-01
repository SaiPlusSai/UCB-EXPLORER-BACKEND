const pool = require("../../../config/database");

const crear = async ({ visitante_id, producto_id, cantidad = 1 }) => {
  const { rows } = await pool.query(
    `INSERT INTO reservas_store (visitante_id, producto_id, cantidad)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [visitante_id, producto_id, cantidad]
  );
  return rows[0];
};

const listarPorVisitante = async (visitante_id) => {
  const { rows } = await pool.query(
    `SELECT r.*, p.nombre, p.precio, p.imagen_url, p.categoria
     FROM reservas_store r
     JOIN productos_store p ON p.id = r.producto_id
     WHERE r.visitante_id = $1
     ORDER BY r.creado_en DESC`,
    [visitante_id]
  );
  return rows;
};

const obtener = async (id) => {
  const { rows } = await pool.query(
    `SELECT r.*, p.nombre, p.precio, p.imagen_url
     FROM reservas_store r
     JOIN productos_store p ON p.id = r.producto_id
     WHERE r.id = $1`,
    [id]
  );
  return rows[0] || null;
};

const cancelar = async (id, visitante_id) => {
  const { rows } = await pool.query(
    `UPDATE reservas_store
     SET estado = 'cancelada'
     WHERE id = $1 AND visitante_id = $2 AND estado = 'pendiente'
     RETURNING *`,
    [id, visitante_id]
  );
  return rows[0] || null;
};

module.exports = { crear, listarPorVisitante, obtener, cancelar };
