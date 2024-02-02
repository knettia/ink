const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

let serverTable = [];

const SERVER_NOT_FOUND_ERROR = 'Server not found.';
const SERVER_INIT_SUCCESS_MESSAGE = 'Server initialized successfully.';
const SERVER_DESTROY_SUCCESS_MESSAGE = 'Server destroyed successfully.';

app.post('/api/initialize', (req, res) => {
  const { iso, ip } = req.body;

  if (!iso || !ip) {
    return res.status(400).json({ error: 'Both iso and ip are required in the initialize request.' });
  }

  serverTable.push({ iso, ip });
  res.json({ message: SERVER_INIT_SUCCESS_MESSAGE });
});

app.get('/api/get_server/:param', (req, res) => {
  const { param } = req.params;
  const result = param.includes('.') ? serverTable.find(server => server.ip === param) : serverTable.filter(server => server.iso === param);

  if (!result || (Array.isArray(result) && result.length === 0)) {
    return res.status(404).json({ error: SERVER_NOT_FOUND_ERROR });
  }

  res.json(result);
});

app.delete('/api/destroy_server/:ip', (req, res) => {
  const { ip } = req.params;
  serverTable = serverTable.filter(server => server.ip !== ip);

  if (serverTable.length === 0) {
    return res.status(404).json({ error: SERVER_NOT_FOUND_ERROR });
  }

  res.json({ message: SERVER_DESTROY_SUCCESS_MESSAGE });
});

app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});
