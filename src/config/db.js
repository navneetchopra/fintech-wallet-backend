const { Pool } = require("pg");

console.log("DB_URL =", process.env.DB_URL);

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;