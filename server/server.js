const express = require('express');
const bodyParser = require('body-parser');

const fetchHtml = require('../controllers/fetchHtml');

const app = express();

app.use(bodyParser.json());

app.post('/', (req, res) => {
  return fetchHtml(req, res);
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
