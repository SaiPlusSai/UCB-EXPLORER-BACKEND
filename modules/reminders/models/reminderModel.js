const pool = require("../../../config/database");

const porVisitante = async (
  visitante_id
) => {

  const { rows } = await pool.query(
    `SELECT
        r.*,
        c.nombre AS carrera_nombre
     FROM recordatorios r
     LEFT JOIN carreras c
       ON c.id = r.carrera_id
     WHERE r.visitante_id = $1
        OR r.creado_por_admin = TRUE
     ORDER BY
       r.fecha_recordatorio NULLS LAST,
       r.creado_en DESC`,
    [visitante_id]
  );

  return rows;
};

const obtener = async (id) => {

  const { rows } = await pool.query(
    `SELECT *
     FROM recordatorios
     WHERE id = $1`,
    [id]
  );

  return rows[0] || null;
};

const crearVisitante = async ({
  visitante_id,
  carrera_id,
  titulo,
  descripcion,
  fecha_recordatorio,
}) => {

  const { rows } = await pool.query(
    `INSERT INTO recordatorios
      (
        visitante_id,
        carrera_id,
        titulo,
        descripcion,
        fecha_recordatorio,
        creado_por_admin
      )
     VALUES
      ($1, $2, $3, $4, $5, FALSE)
     RETURNING *`,
    [
      visitante_id,
      carrera_id || null,
      titulo,
      descripcion || null,
      fecha_recordatorio || null,
    ]
  );

  return rows[0];
};

const actualizar = async (
  id,
  {
    titulo,
    descripcion,
    fecha_recordatorio,
    carrera_id,
  }
) => {

  const { rows } = await pool.query(
    `UPDATE recordatorios
     SET
       titulo = COALESCE($2, titulo),

       descripcion = COALESCE(
         $3,
         descripcion
       ),

       fecha_recordatorio = COALESCE(
         $4,
         fecha_recordatorio
       ),

       carrera_id = COALESCE(
         $5,
         carrera_id
       )

     WHERE id = $1

     RETURNING *`,
    [
      id,
      titulo,
      descripcion,
      fecha_recordatorio,
      carrera_id,
    ]
  );

  return rows[0] || null;
};

const eliminar = async (id) => {

  await pool.query(
    `DELETE FROM recordatorios
     WHERE id = $1`,
    [id]
  );
};

const crearAdmin = async ({
  titulo,
  descripcion,
  carrera_id,
  fecha_recordatorio,
}) => {

  const { rows } = await pool.query(
    `INSERT INTO recordatorios
       (titulo, descripcion, carrera_id, fecha_recordatorio, creado_por_admin)
     VALUES ($1, $2, $3, $4, TRUE)
     RETURNING *`,
    [
      titulo,
      descripcion || null,
      carrera_id || null,
      fecha_recordatorio || null,
    ]
  );

  return rows[0];
};

const todosAdmin = async () => {

  const { rows } = await pool.query(
    `SELECT
        r.*,
        c.nombre AS carrera_nombre
     FROM recordatorios r
     LEFT JOIN carreras c ON c.id = r.carrera_id
     WHERE r.creado_por_admin = TRUE
     ORDER BY r.fecha_recordatorio NULLS LAST, r.creado_en DESC`
  );

  return rows;
};

module.exports = {
  porVisitante,
  obtener,
  crearVisitante,
  actualizar,
  eliminar,
  crearAdmin,
  todosAdmin,
};