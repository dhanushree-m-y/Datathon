'use strict';

const express = require('express');
const scenarios = require('./scenarios');

const app = express();
app.use(express.json());

// Permissive CORS so the hosted client (and local preview) can call the function.
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Health / info
app.get('/', (req, res) => {
  res.json({ service: 'Drishti mock API', ok: true, endpoints: ['GET|POST /query'] });
});

// Conversational query -> evidence-backed answer
app.post('/query', (req, res) => {
  const text = (req.body && req.body.text) || '';
  res.json(scenarios.resolve(text));
});
app.get('/query', (req, res) => {
  res.json(scenarios.resolve(req.query.q || ''));
});

module.exports = app;
