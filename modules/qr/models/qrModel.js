const pool = require("../../../config/database");

const registrarEscaneo = async ({
  visitante_id,
  contenido_qr,
  puntos_otorgados = 0,
}) => {

  const { rows } = await pool.query(
    `INSERT INTO escaneos_qr
      (
        visitante_id,
        contenido_qr,
        puntos_otorgados
      )
     VALUES ($1, $2, $3)
     RETURNING *`,
    [
      visitante_id,
      contenido_qr,
      puntos_otorgados,
    ]
  );

  return rows[0];
};

const yaEscaneado = async (
  visitante_id,
  contenido_qr
) => {

  const { rows } = await pool.query(
    `SELECT id
     FROM escaneos_qr
     WHERE visitante_id = $1
     AND contenido_qr = $2`,
    [visitante_id, contenido_qr]
  );

  return rows.length > 0;
};

const escaneosPorVisitante = async (
  visitante_id
) => {

  const { rows } = await pool.query(
    `SELECT *
     FROM escaneos_qr
     WHERE visitante_id = $1
     ORDER BY escaneado_en DESC`,
    [visitante_id]
  );

  return rows;
};

const todosEscaneos = async () => {

  const { rows } = await pool.query(
    `SELECT
        eq.*,
        v.id AS visitante
     FROM escaneos_qr eq
     JOIN visitantes v
       ON v.id = eq.visitante_id
     ORDER BY eq.escaneado_en DESC
     LIMIT 500`
  );

  return rows;
};

const guardarQRGenerado = async ({
  tipo,
  contenido_json,
  qr_base64,
  admin_id,
}) => {

  const { rows } = await pool.query(
    `INSERT INTO qr_generados
      (
        tipo,
        contenido_json,
        qr_base64,
        creado_por_admin_id
      )
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [
      tipo,
      contenido_json,
      qr_base64,
      admin_id,
    ]
  );

  return rows[0];
};

const listarQRGenerados = async () => {

  const { rows } = await pool.query(
    `SELECT *
     FROM qr_generados
     WHERE activo = TRUE
     ORDER BY id DESC`
  );

  return rows;
};

module.exports = {
  registrarEscaneo,
  yaEscaneado,
  escaneosPorVisitante,
  todosEscaneos,
  guardarQRGenerado,
  listarQRGenerados,
};
 