let mysql = null;

try {
  mysql = require('mysql2/promise');
} catch (error) {
  mysql = null;
}

const hasDatabaseConfig = Boolean(
  mysql && process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME
);

const pool = hasDatabaseConfig
  ? mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  : null;

async function query(sql, params = []) {
  if (!pool) {
    return null;
  }

  const [rows] = await pool.execute(sql, params);
  return rows;
}

module.exports = { pool, query, hasDatabaseConfig };