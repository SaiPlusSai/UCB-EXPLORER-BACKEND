const pool = require("../../../config/database");

const buscarPorCodigo = async (codigo) => {
  const { rows } = await pool.query(
    `SELECT * FROM tickets WHERE codigo_ticket = $1`,
    [codigo]
  );
  return rows[0] || null;
};

const obtener = async (id) => {
  const { rows } = await pool.query(`SELECT * FROM tickets WHERE id = $1`, [id]);
  return rows[0] || null;
};

const crearTicket = async ({ codigo_ticket, datos_externos = null, validado = false }) => {
  const { rows } = await pool.query(
    `INSERT INTO tickets (codigo_ticket, datos_externos, validado)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [codigo_ticket, datos_externos, validado]
  );
  return rows[0];
};

const marcarValidado = async (id) => {
  const { rows } = await pool.query(
    `UPDATE tickets SET validado = TRUE WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows[0];
};

module.exports = { buscarPorCodigo, obtener, crearTicket, marcarValidado };
