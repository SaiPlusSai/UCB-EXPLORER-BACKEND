require("dotenv").config();
const pool = require("../config/database");

async function migrate() {
  console.log("Running migrations...");

  try {
    // 1. Add columns to visitantes table
    await pool.query(`
      ALTER TABLE visitantes
        ADD COLUMN IF NOT EXISTS email VARCHAR(255),
        ADD COLUMN IF NOT EXISTS nombre VARCHAR(255),
        ADD COLUMN IF NOT EXISTS telefono VARCHAR(50),
        ADD COLUMN IF NOT EXISTS ci VARCHAR(50),
        ADD COLUMN IF NOT EXISTS fecha_nacimiento DATE,
        ADD COLUMN IF NOT EXISTS tipo_visitante VARCHAR(50) DEFAULT 'estudiante',
        ADD COLUMN IF NOT EXISTS parentesco VARCHAR(100),
        ADD COLUMN IF NOT EXISTS nombre_estudiante VARCHAR(255)
    `);
    console.log("✅ visitantes columns added");

    // 2. Create productos_store table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS productos_store (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(200) NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10,2) NOT NULL,
        categoria VARCHAR(100),
        imagen_url TEXT,
        stock INT DEFAULT 0,
        activo BOOLEAN DEFAULT TRUE,
        creado_en TIMESTAMP DEFAULT NOW(),
        actualizado_en TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✅ productos_store table created");

    // 3. Create reservas_store table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reservas_store (
        id SERIAL PRIMARY KEY,
        visitante_id INT NOT NULL REFERENCES visitantes(id),
        producto_id INT NOT NULL REFERENCES productos_store(id),
        cantidad INT DEFAULT 1,
        estado VARCHAR(50) DEFAULT 'pendiente',
        creado_en TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✅ reservas_store table created");

    // 4. Insert sample products if none exist
    const { rows } = await pool.query("SELECT COUNT(*)::int AS total FROM productos_store");
    if (rows[0].total === 0) {
      await pool.query(`
        INSERT INTO productos_store (nombre, descripcion, precio, categoria, stock, activo) VALUES
          ('Polera UCB', 'Polera oficial de la Universidad Católica Boliviana con logo bordado. Material algodón premium.', 85.00, 'Ropa', 50, true),
          ('Taza UCB Explorer', 'Taza de cerámica con diseño exclusivo del Open House UCB Explorer.', 35.00, 'Accesorios', 100, true),
          ('Mochila UCB', 'Mochila resistente con compartimentos para laptop y logo UCB.', 150.00, 'Accesorios', 30, true),
          ('Cuaderno UCB', 'Cuaderno universitario con tapa dura y 200 hojas. Diseño exclusivo.', 25.00, 'Papelería', 200, true),
          ('Gorra UCB', 'Gorra ajustable con logo bordado de la UCB. Color azul marino.', 45.00, 'Ropa', 80, true),
          ('Stickers Pack UCB', 'Pack de 10 stickers con diseños de las carreras de la UCB.', 15.00, 'Accesorios', 150, true),
          ('Botella Térmica UCB', 'Botella de acero inoxidable 500ml con grabado UCB. Mantiene temperatura 12hrs.', 65.00, 'Accesorios', 40, true),
          ('Llavero UCB', 'Llavero metálico con escudo de la UCB. Acabado premium.', 20.00, 'Accesorios', 200, true)
      `);
      console.log("✅ Sample products inserted");
    } else {
      console.log("ℹ️  Products already exist, skipping seed");
    }

    console.log("\n🎉 All migrations completed successfully!");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
  } finally {
    await pool.end();
  }
}

migrate();
