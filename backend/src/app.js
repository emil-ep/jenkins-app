const express = require('express');
const cors = require('cors');
const { createStore } = require('./store');

/**
 * Build the Express app with an optional pre-seeded store.
 * Separating app creation from server startup lets tests import
 * the app without binding a port.
 */
function createApp(store = createStore()) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // GET /api/todos — list all todos
  app.get('/api/todos', (_req, res) => {
    res.json(store.getAll());
  });

  // POST /api/todos — create a todo
  app.post('/api/todos', (req, res) => {
    const { title } = req.body;
    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'title is required' });
    }
    const todo = store.create(title);
    res.status(201).json(todo);
  });

  // PATCH /api/todos/:id — update title and/or completed
  app.patch('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const todo = store.update(id, req.body);
    if (!todo) return res.status(404).json({ error: 'not found' });
    res.json(todo);
  });

  // DELETE /api/todos/:id — remove a todo
  app.delete('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const removed = store.remove(id);
    if (!removed) return res.status(404).json({ error: 'not found' });
    res.status(204).end();
  });

  return app;
}

module.exports = { createApp };
