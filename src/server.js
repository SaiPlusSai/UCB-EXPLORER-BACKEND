const app = require("./app");
const pool = require("../config/database");

require("dotenv").config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {

  try {

    const client = await pool.connect();

    console.log(" PostgreSQL conectado correctamente");

    client.release();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en: http://localhost:${PORT}`);
    });

  } catch (error) {

    console.error(" Error conectando PostgreSQL");
    console.error(error);

  }
};

startServer();