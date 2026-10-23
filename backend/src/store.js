/**
 * Todo store — in-memory, no external dependencies.
 * Exported as a factory so tests can create isolated instances.
 */
function createStore() {
  let todos = [];
  let nextId = 1;

  
  return {
    getAll() {
      return [...todos];
    },
    getById(id) {
      return todos.find((t) => t.id === id) || null;
    },
    create(title) {
      const todo = { id: nextId++, title: String(title).trim(), completed: false };
      todos.push(todo);
      return todo;
    },
    update(id, patch) {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return null;
      if (typeof patch.title === 'string') todo.title = String(patch.title).trim();
      if (typeof patch.completed === 'boolean') todo.completed = patch.completed;
      return todo;
    },
    remove(id) {
      const index = todos.findIndex((t) => t.id === id);
      if (index === -1) return false;
      todos.splice(index, 1);
      return true;
    },
    /** Reset for tests */
    _reset() {
      todos = [];
      nextId = 1;
    },
  };
}

module.exports = { createStore };
