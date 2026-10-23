import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock fetch globally
const makeTodo = (id, title, completed = false) => ({ id, title, completed });

beforeEach(() => {
  jest.resetAllMocks();
});

test('renders the heading', async () => {
  global.fetch = jest.fn().mockResolvedValueOnce({
    ok: true,
    json: async () => [],
  });

  render(<App />);
  expect(screen.getByText('Todo App')).toBeInTheDocument();
  // wait for initial fetch to settle
  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
});

test('displays fetched todos on mount', async () => {
  global.fetch = jest.fn().mockResolvedValueOnce({
    ok: true,
    json: async () => [makeTodo(1, 'Buy milk'), makeTodo(2, 'Walk the dog', true)],
  });

  render(<App />);
  expect(await screen.findByText('Buy milk')).toBeInTheDocument();
  expect(await screen.findByText('Walk the dog')).toBeInTheDocument();
});

test('adds a new todo', async () => {
  // initial load returns empty
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({ ok: true, json: async () => [] })
    // POST response
    .mockResolvedValueOnce({ ok: true, json: async () => makeTodo(1, 'New task') });

  render(<App />);
  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

  fireEvent.change(screen.getByPlaceholderText(/what needs to be done/i), {
    target: { value: 'New task' },
  });
  fireEvent.click(screen.getByText('Add'));

  expect(await screen.findByText('New task')).toBeInTheDocument();
});

test('deletes a todo', async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({ ok: true, json: async () => [makeTodo(1, 'Delete me')] })
    // DELETE
    .mockResolvedValueOnce({ ok: true });

  render(<App />);
  expect(await screen.findByText('Delete me')).toBeInTheDocument();

  fireEvent.click(screen.getByLabelText(/delete "Delete me"/i));

  await waitFor(() => expect(screen.queryByText('Delete me')).not.toBeInTheDocument());
});

test('shows error when fetch fails', async () => {
  global.fetch = jest.fn().mockRejectedValueOnce(new Error('network'));

  render(<App />);
  expect(await screen.findByText(/could not load todos/i)).toBeInTheDocument();
});
