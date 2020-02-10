const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('../lib/config');
const { OpenApiValidator } = require('express-openapi-validator');

const apiSpec = require('../../definitions.json');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

apiSpec.servers = [];
new OpenApiValidator({
  apiSpec,
  validateRequests: true
}).installSync(app);

/*
 * Routes
 */
app.use('/pets', require('./routes/pets'));

// catch 404
app.use((req, res, next) => {
  console.error(`Error 404 on ${req.url}.`);
  res.status(404).send({ status: 404, error: 'Not found' });
});

// catch errors
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const msg = err.error || err.message;
  console.error(`Error ${status} (${msg}) on ${req.method} ${req.url} with payload ${req.body}.`);
  res.status(status).send({ status, error: msg });
});

module.exports = app;
