
"use client";
const TODOS_KEY = "todos";

type Todo = {
  id: number;
  todo: string;
  completed: boolean;
};

export const getTodosFromLocalStorage = () => {
  const savedTodos: Todo[] = JSON.parse(
    localStorage.getItem(TODOS_KEY) || "[]",
  );
  return savedTodos || [];
};

/**
 * Save todos to localStorage.
 * @param {Array} todos - The list of todos to save.
 */
export const saveTodosToLocalStorage = (todos: Todo[]) => {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
};

/**
 * Update a specific todo in localStorage.
 * @param {number} id - The ID of the todo to update.
 * @param {Object} updatedTodo - The updated todo object.
 */
interface UpdateTodo {
  todo?: string;
  completed?: boolean;
}

export const updateTodoInLocalStorage = (
  id: number,
  updatedTodo: UpdateTodo,
): Todo[] => {
  const todos = getTodosFromLocalStorage();
  const updatedTodos = todos.map((todo) =>
    todo.id === id ? { ...todo, ...updatedTodo } : todo,
  );
  saveTodosToLocalStorage(updatedTodos);
  return updatedTodos;
};