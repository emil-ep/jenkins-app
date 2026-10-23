const request = require('supertest');
const { createApp } = require('../src/app');
const { createStore } = require('../src/store');

describe('Todo API', () => {
  let app;
  let store;

  beforeEach(() => {
    store = createStore();
    app = createApp(store);
  });

  describe('GET /api/todos', () => {
    it('returns an empty array initially', async () => {
      const res = await request(app).get('/api/todos');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns created todos', async () => {
      store.create('Buy milk');
      const res = await request(app).get('/api/todos');
      expect(res.body).toHaveLength(1);
      expect(res.body[0].title).toBe('Buy milk');
    });
  });

  describe('POST /api/todos', () => {
    it('creates a todo and returns 201', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ title: 'Write tests' });
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ id: 1, title: 'Write tests', completed: false });
    });

    it('returns 400 when title is missing', async () => {
      const res = await request(app).post('/api/todos').send({});
      expect(res.status).toBe(400);
    });

    it('returns 400 when title is blank', async () => {
      const res = await request(app).post('/api/todos').send({ title: '   ' });
      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /api/todos/:id', () => {
    it('marks a todo as completed', async () => {
      store.create('Do laundry');
      const res = await request(app)
        .patch('/api/todos/1')
        .send({ completed: true });
      expect(res.status).toBe(200);
      expect(res.body.completed).toBe(true);
    });

    it('updates the title', async () => {
      store.create('Old title');
      const res = await request(app)
        .patch('/api/todos/1')
        .send({ title: 'New title' });
      expect(res.body.title).toBe('New title');
    });

    it('returns 404 for unknown id', async () => {
      const res = await request(app).patch('/api/todos/99').send({ completed: true });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('deletes a todo and returns 204', async () => {
      store.create('Task');
      const res = await request(app).delete('/api/todos/1');
      expect(res.status).toBe(204);
    });

    it('returns 404 for unknown id', async () => {
      const res = await request(app).delete('/api/todos/99');
      expect(res.status).toBe(404);
    });
  });
});
