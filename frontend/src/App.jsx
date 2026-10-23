import React, { useEffect, useState } from 'react';
import './App.css';

const API = '/api/todos';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  // Load todos on mount
  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then(setTodos)
      .catch(() => setError('Could not load todos.'));
  }, []);

  async function addTodo(e) {
    e.preventDefault();
    const title = input.trim();
    if (!title) return;
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error('Failed to create');
      const todo = await res.json();
      setTodos((prev) => [...prev, todo]);
      setInput('');
    } catch {
      setError('Could not add todo.');
    }
  }

  async function toggleTodo(id, completed) {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch {
      setError('Could not update todo.');
    }
  }

  async function deleteTodo(id) {
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError('Could not delete todo.');
    }
  }

  return (
    <main className="container">
      <h1>Todo App</h1>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={addTodo} className="add-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
          aria-label="New todo title"
        />
        <button type="submit">Add</button>
      </form>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id, todo.completed)}
              aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
            />
            <span className="title">{todo.title}</span>
            <button
              onClick={() => deleteTodo(todo.id)}
              aria-label={`Delete "${todo.title}"`}
              className="delete"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p className="empty">No todos yet. Add one above!</p>}
    </main>
  );
}
