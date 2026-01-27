const mysql = require('mysql');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'testdb',
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});

module.exports = pool;
