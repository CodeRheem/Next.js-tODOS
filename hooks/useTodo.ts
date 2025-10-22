
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  getTodosFromLocalStorage,
  saveTodosToLocalStorage,
  updateTodoInLocalStorage,
} from "../storage/localstorage";

// API base URL
const API_URL = "https://dummyjson.com/todos";

export function useTodos() {
  // Query client for invalidating queries
  const queryClient = useQueryClient();

  // Query for fetching todos
  // data: todos = [] is a default value for the todos state
  // isLoading is a boolean that indicates if the todos are loading
  // error is an error object that indicates if there is an error
  const {
    data: todos = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      // First check localStorage for immediate response
      const savedTodos = getTodosFromLocalStorage();
      if (savedTodos?.length > 0) {
        return savedTodos;
      }

      // If no todos in localStorage, fetch from API
      try {
        const response = await axios.get(API_URL);
        const apiTodos = response.data.todos;
        // Save API todos to localStorage
        saveTodosToLocalStorage(apiTodos);
        return apiTodos;
      } catch (error) {
        console.error("Error fetching todos:", error);
        return [];
      }
    },
  });

  // Mutation for adding a todo
  type NewTodo = {
    todo: string;
  };

  const addTodoMutation = useMutation({
    mutationFn: async (newTodo: NewTodo) => {
      try {
        // Try to add to API first
        const response = await axios.post(
          API_URL + "/add",
          {
            todo: newTodo.todo,
            completed: false,
            userId: Math.floor(Math.random() * 10) + 1, // Random userId between 1-10
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        // Get current todos from localStorage
        const currentTodos = getTodosFromLocalStorage() || [];

        // Add the new todo from API response to localStorage with a unique ID
        const apiTodo = {
          ...response.data,
          id: Date.now(), // Ensure unique ID for local storage
        };
        const updatedTodos = [apiTodo, ...currentTodos];
        saveTodosToLocalStorage(updatedTodos);

        return apiTodo;
      } catch (error) {
        console.error("Error adding todo to API:", error);
        // If API fails, create a local todo
        const localTodo = {
          id: Date.now(),
          todo: newTodo.todo,
          completed: false,
          userId: Math.floor(Math.random() * 10) + 1, // Random userId between 1-10
        };

        // Add local todo to localStorage
        const currentTodos = getTodosFromLocalStorage() || [];
        const updatedTodos = [localTodo, ...currentTodos];
        saveTodosToLocalStorage(updatedTodos);

        return localTodo;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // Mutation for deleting a todo
  const deleteTodoMutation = useMutation({
    mutationFn: async (todoId: number) => {
      const isApiTodo = todoId < 100;

      if (isApiTodo) {
        try {
          // Only try to delete from API if it's an API todo
          await axios.delete(`${API_URL}/${todoId}`);
        } catch (error) {
          console.error("Error deleting todo from API:", error);
        }
      }

      // Get current todos from localStorage
      const currentTodos = getTodosFromLocalStorage() || [];

      // Remove the todo from localStorage
      const updatedTodos = currentTodos.filter((todo) => todo.id !== todoId);
      saveTodosToLocalStorage(updatedTodos);

      return todoId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // Mutation for toggling todo completion
  const toggleTodoMutation = useMutation({
    mutationFn: async (todoId: number) => {
      // Get current todos from localStorage
      const currentTodos = getTodosFromLocalStorage() || [];
      const todoToUpdate = currentTodos.find((todo) => todo.id === todoId);

      if (!todoToUpdate) {
        throw new Error("Todo not found");
      }

      const isApiTodo = todoId < 100;

      try {
        if (isApiTodo) {
          // Try to update in API first
          const response = await axios.put(
            `${API_URL}/${todoId}`,
            {
              ...todoToUpdate,
              completed: !todoToUpdate.completed,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          // Update in localStorage with API response
          updateTodoInLocalStorage(todoId, response.data);
          return response.data;
        } else {
          // For local todos, just update in localStorage
          const updatedTodo = {
            ...todoToUpdate,
            completed: !todoToUpdate.completed,
          };
          updateTodoInLocalStorage(todoId, updatedTodo);
          return updatedTodo;
        }
      } catch (error) {
        console.error("Error updating todo in API:", error);
        // If API update fails, still update localStorage
        const updatedTodo = {
          ...todoToUpdate,
          completed: !todoToUpdate.completed,
        };
        updateTodoInLocalStorage(todoId, updatedTodo);
        return updatedTodo;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return {
    todos,
    isLoading,
    error,
    addTodo: addTodoMutation.mutate,
    deleteTodo: deleteTodoMutation.mutate,
    toggleTodo: toggleTodoMutation.mutate,
  };
}