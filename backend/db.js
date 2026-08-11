const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const caPath =
  process.env.DB_CA_PATH ||
  path.join(__dirname, "ca.pem");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: {
    ca: fs.readFileSync(caPath),
    rejectUnauthorized: true
  }
});

connection.connect((err) => {

  if (err) {
    console.error("Error MySQL:", err);
    return;
  }

  console.log("MySQL conectado");
});

module.exports = connection;