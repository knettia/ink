const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const serverTable = [];

app.post('/api/initialize', (req, res) => {
  const { iso, ip } = req.body;

  if (!iso || !ip) {
    return res.status(400).json({ error: 'Both iso and ip are required in the initialize request.' });
  }

  serverTable.push({ iso, ip });
  res.json({ message: 'Server initialized successfully.' });
});

app.get('/api/get_server/:param', (req, res) => {
  const param = req.params.param;
  let result;

  if (param.includes('.')) {
    result = serverTable.find(server => server.ip === param);
  } else {
    result = serverTable.filter(server => server.iso === param);
  }

  if (!result) {
    return res.status(404).json({ error: 'Server not found.' });
  }

  res.json(result);
});

app.delete('/api/destroy_server/:ip', (req, res) => {
  const ipToDelete = req.params.ip;

  const index = serverTable.findIndex(server => server.ip === ipToDelete);

  if (index === -1) {
    return res.status(404).json({ error: 'Server not found.' });
  }

  serverTable.splice(index, 1);
  res.json({ message: 'Server destroyed successfully.' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
