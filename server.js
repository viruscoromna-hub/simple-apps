const app = require('./app');

function getPort() {
  return Number(process.env.APP_PORT) || 3000;
}

const start = () => {
  const port = getPort();
  const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
  return server;
};

module.exports = {
  start,
  getPort,
};
