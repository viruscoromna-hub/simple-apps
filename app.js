const express = require('express');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const logger = require('./middleware/logger');
const pool = require('./middleware/db_connect');

const requiredEnv = ['APP_PORT', 'DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME'];
const missingEnv = requiredEnv.filter((variable) => !process.env[variable]);
if (missingEnv.length > 0) {
  console.warn(`Some environment variables are not set: ${missingEnv.join(', ')}`);
}

const releaseInfo = {
  name: 'IDN DevOps Simple Apps',
  version: '1.0.0',
  description: 'API kecil dengan antarmuka yang bersih dan siap audit',
};
const fallbackUsers = [
  { id: 0, name: 'Guest Participant', role: 'Developer', status: 'Fallback data' },
  { id: -1, name: 'IDN DevOps', role: 'Platform', status: 'Ready' },
];

const app = express();
const port = Number(process.env.APP_PORT) || 3000;

app.disable('x-powered-by');
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
      },
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/app1', (req, res) => {
  res.json({ message: 'Hello this Apps 1!' });
});

app.get('/app2', (req, res) => {
  res.json({ message: 'Hello this App 2!' });
});

app.get('/status', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
    env: process.env.NODE_ENV || 'development',
    version: releaseInfo.version,
  });
});

app.get('/meta', (_req, res) => {
  res.json(releaseInfo);
});

app.get('/users', (req, res, next) => {
  const sql = 'SELECT * FROM tb_data ORDER BY id DESC';
  pool.query(sql, (error, results) => {
    if (error) {
      console.error('users query failed', error.code || error.message || error);
      return res.status(200).json(fallbackUsers);
    }

    res.json(results);
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

app.use((error, req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;

