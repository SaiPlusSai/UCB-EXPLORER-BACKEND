const pool = require("../../../config/database");

const listar = async ({ categoria, activo = true } = {}) => {
  let query = `
    SELECT id, nombre, descripcion, precio, categoria, imagen_url, stock, activo, creado_en
    FROM productos_store
    WHERE 1=1
  `;
  const params = [];

  if (activo !== null && activo !== undefined) {
    params.push(activo);
    query += ` AND activo = $${params.length}`;
  }

  if (categoria) {
    params.push(categoria);
    query += ` AND LOWER(categoria) = LOWER($${params.length})`;
  }

  query += ` ORDER BY categoria ASC, nombre ASC`;

  const { rows } = await pool.query(query, params);
  return rows;
};

const obtener = async (id) => {
  const { rows } = await pool.query(
    `SELECT * FROM productos_store WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
};

const listarCategorias = async () => {
  const { rows } = await pool.query(
    `SELECT DISTINCT categoria FROM productos_store WHERE activo = TRUE AND categoria IS NOT NULL ORDER BY categoria ASC`
  );
  return rows.map((r) => r.categoria);
};

const reducirStock = async (id, cantidad = 1) => {
  const { rows } = await pool.query(
    `UPDATE productos_store
     SET stock = stock - $2, actualizado_en = NOW()
     WHERE id = $1 AND stock >= $2
     RETURNING *`,
    [id, cantidad]
  );
  return rows[0] || null;
};

module.exports = { listar, obtener, listarCategorias, reducirStock };
