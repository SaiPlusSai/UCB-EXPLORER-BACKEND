const pool = require("../../../config/database");

const normalizar = (texto = '') => {
  if (typeof texto !== 'string') {
    return ''
  }

  return texto
    .trim()
    .replace(/\s+/g, ' ')
};

const listar = async () => {
  const { rows } = await pool.query(`
    SELECT
      id,
      nombre,
      direccion,
      ciudad,
      departamento,
      pais,
      creado_por_admin_id,
      creado_en,
      actualizado_en
    FROM colegios
    ORDER BY nombre ASC
  `);

  return rows;
};

const obtener = async (id) => {
  const { rows } = await pool.query(
    `
      SELECT *
      FROM colegios
      WHERE id = $1
    `,
    [id]
  );

  return rows[0] || null;
};

const crear = async ({
  nombre,
  direccion,
  ciudad,
  departamento,
  pais,
  adminId,
}) => {

  const nombreLimpio = normalizar(nombre);

  if (!nombreLimpio) {
    throw new Error("El nombre del colegio es obligatorio");
  }

  if (!normalizar(ciudad)) {
    throw new Error("La ciudad es obligatoria");
  }

  if (!normalizar(departamento)) {
    throw new Error("El departamento es obligatorio");
  }

  const existente = await pool.query(
    `
      SELECT id
      FROM colegios
      WHERE
        LOWER(TRIM(nombre)) = LOWER(TRIM($1))
        AND LOWER(TRIM(ciudad)) = LOWER(TRIM($2))
        AND LOWER(TRIM(departamento)) = LOWER(TRIM($3))
    `,
    [
      nombreLimpio,
      normalizar(ciudad),
      normalizar(departamento),
    ]
  );

  if (existente.rows.length > 0) {
    throw new Error(
      "Ya existe un colegio con ese nombre en esa ciudad"
    );
  }

  const { rows } = await pool.query(
    `
      INSERT INTO colegios (
        nombre,
        direccion,
        ciudad,
        departamento,
        pais,
        creado_por_admin_id
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
    [
      nombreLimpio,
      normalizar(direccion),
      normalizar(ciudad),
      normalizar(departamento),
      normalizar(pais || 'Bolivia'),
      adminId,
    ]
  );

  return rows[0];
};

const actualizar = async (
  id,
  {
    nombre,
    direccion,
    ciudad,
    departamento,
    pais,
  }
) => {

  const colegioActual = await obtener(id);

  if (!colegioActual) {
    throw new Error("Colegio no encontrado");
  }

  const nuevoNombre =
    nombre !== undefined
      ? normalizar(nombre)
      : colegioActual.nombre;

  const nuevaCiudad =
    ciudad !== undefined
      ? normalizar(ciudad)
      : colegioActual.ciudad;

  const nuevoDepartamento =
    departamento !== undefined
      ? normalizar(departamento)
      : colegioActual.departamento;

  const nuevoPais =
    pais !== undefined
      ? normalizar(pais)
      : colegioActual.pais;

  const nuevaDireccion =
    direccion !== undefined
      ? normalizar(direccion)
      : colegioActual.direccion;

  const duplicado = await pool.query(
    `
      SELECT id
      FROM colegios
      WHERE
        LOWER(TRIM(nombre)) = LOWER(TRIM($1))
        AND LOWER(TRIM(ciudad)) = LOWER(TRIM($2))
        AND LOWER(TRIM(departamento)) = LOWER(TRIM($3))
        AND id != $4
    `,
    [
      nuevoNombre,
      nuevaCiudad,
      nuevoDepartamento,
      id,
    ]
  );

  if (duplicado.rows.length > 0) {
    throw new Error(
      "Ya existe otro colegio con ese nombre en esa ciudad"
    );
  }

  const { rows } = await pool.query(
    `
      UPDATE colegios
      SET
        nombre = $2,
        direccion = $3,
        ciudad = $4,
        departamento = $5,
        pais = $6,
        actualizado_en = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [
      id,
      nuevoNombre,
      nuevaDireccion,
      nuevaCiudad,
      nuevoDepartamento,
      nuevoPais,
    ]
  );

  return rows[0] || null;
};

const eliminar = async (id) => {

  const visitantes = await pool.query(
    `
      SELECT COUNT(*)::int AS total
      FROM visitantes
      WHERE colegio_id = $1
    `,
    [id]
  );

  if (visitantes.rows[0].total > 0) {
    throw new Error(
      "No se puede eliminar el colegio porque tiene visitantes asociados"
    );
  }

  await pool.query(
    `
      DELETE FROM colegios
      WHERE id = $1
    `,
    [id]
  );
};

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar,
};