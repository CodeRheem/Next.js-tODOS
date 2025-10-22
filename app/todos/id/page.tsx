

"use client";
import { useParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTodosFromLocalStorage,
  updateTodoInLocalStorage,
} from "../../../storage/localstorage";
import axios from "axios";
import { Skeleton } from "@mui/material";
import Head from "next/head";

function DynamicHead() {
  return (
    <Head>
      <title> Todo Details</title>
      <meta
        name="description"
        content={`Details and status for 'View details for your todo.`}
      />
    </Head>
  );
}

const API_URL = "https://dummyjson.com/todos";

const TodoDetails = () => {
  DynamicHead();
  // Get the todo ID from the URL
  const { id } = useParams();
  const router = useRouter();
  // State for editing mode
  const [isEditing, setIsEditing] = useState(false);
  // State for the todo title
  const [title, setTitle] = useState("");
  // Query client for invalidating queries
  const queryClient = useQueryClient();

  // Helper function to check if a todo is from the API
  const isApiTodo = (todoId: number) => {
    return todoId < 100;
  };

  // Query to get the todo details
  const {
    data: todo,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todo", id],
    queryFn: async () => {
      const savedTodos = getTodosFromLocalStorage();
      if (!id) throw new Error("Todo ID is missing");
      const todoId = parseInt(Array.isArray(id) ? id[0] : id);

      // First try to find in localStorage
      const localTodo = savedTodos?.find((t: Todo) => {
        // Compare both as numbers for local todos
        if (t.id >= 100) {
          return t.id === todoId;
        }
        // Compare as numbers for API todos
        return t.id === todoId;
      });

      if (localTodo) {
        setTitle(localTodo.todo);
        return localTodo;
      }

      // If not found in localStorage and it's an API todo, try fetching from API
      if (isApiTodo(todoId)) {
        try {
          const response = await axios.get(`${API_URL}/${todoId}`);
          setTitle(response.data.todo);
          return response.data;
        } catch (error) {
          console.error("Error fetching todo from API:", error);
        }
      }

      throw new Error("Todo not found");
    },
  });

  // Set the page title and meta description using useHead

  // Mutation to update the todo
  interface Todo {
    id: number;
    todo: string;
    completed: boolean;
    [key: string]: string | boolean | number;
  }

  interface UpdateTodoInput {
    todo: string;
  }

  const updateTodoMutation = useMutation<
    Todo, // Return type
    Error, // Error type
    UpdateTodoInput // Variables type
  >({
    mutationFn: async (updatedTodo: UpdateTodoInput): Promise<Todo> => {
      if (!id) throw new Error("Todo ID is missing");
      const todoId = parseInt(Array.isArray(id) ? id[0] : id);

      try {
        if (isApiTodo(todoId)) {
          // Update in API
          const response = await axios.put<Todo>(
            `${API_URL}/${todoId}`,
            {
              ...todo,
              todo: updatedTodo.todo,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          // Update in localStorage
          updateTodoInLocalStorage(todoId, response.data);
          return response.data;
        } else {
          // Update only in localStorage for local todos
          const updatedTodoData: Todo = {
            ...todo,
            todo: updatedTodo.todo,
          };
          updateTodoInLocalStorage(todoId, updatedTodoData);
          return updatedTodoData;
        }
      } catch (error) {
        console.error("Error updating todo:", error);
        // If API update fails, still update localStorage
        const updatedTodoData: Todo = {
          ...todo,
          todo: updatedTodo.todo,
        };
        updateTodoInLocalStorage(todoId, updatedTodoData);
        return updatedTodoData;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todo", id] });
      setIsEditing(false);
      toast.success("Todo updated successfully!");
    },
    onError: () => {
      toast.error("Error updating todo. Please try again.");
    },
  });

  // Function to handle the edit action
  const handleEdit = () => {
    if (!title.trim()) return;
    updateTodoMutation.mutate({ todo: title });
  };

  // Function to start editing the todo
  const startEditing = () => {
    setIsEditing(true);
    setTitle(todo?.todo || "");
  };

  // If the todo is loading, show skeleton loaders
  if (isLoading) {
    return (
      <section className="p-4">
        <Skeleton variant="text" width={300} height={40} className="mb-4" />
        <Skeleton variant="text" width={200} height={30} className="mb-4" />
        <Skeleton
          variant="rectangular"
          width={120}
          height={40}
          className="mb-4"
        />
        <Skeleton variant="rectangular" width={120} height={40} />
      </section>
    );
  }

  // If there is an error, show an error message
  if (error) {
    return (
      <section className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 font-serif">
        <span className="mr-2">⚠️</span>
        {error.message}
      </section>
    );
  }

  // If the todo is not found, show a message
  if (!todo) {
    return (
      <section className="p-4">
        <p className="text-gray-700 font-serif">No todo found.</p>
      </section>
    );
  }

  // If the todo is found, show the todo details
  return (
    <section className="p-4">
      {isEditing ? (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Edit todo title"
            className="w-full p-2 border border-gray-300 rounded-md mb-4 font-serif"
          />
          <button
            onClick={handleEdit}
            aria-label="Save edited todo"
            disabled={!title.trim()}
            className={`px-12 py-2 rounded-md text-white font-serif ${
              title.trim()
                ? "bg-purple-700 hover:bg-purple-800"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Save
          </button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold">{todo?.todo}</h1>
          <p className="mt-2 text-gray-700 font-serif">
            Status: {todo?.completed ? "Completed" : "Pending"}
          </p>
          <button
            onClick={startEditing}
            className="mt-4 px-12 py-2 text-white bg-purple-700 hover:bg-purple-800 rounded-md font-serif cursor-pointer"
          >
            Edit Todo
          </button>
        </>
      )}

      {/* Back to Todo List Button */}
      <button
        onClick={() => router.push("/todos")}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-linear-to-r from-[ #e0cbda] to-[#9f54d6] font-serif ml-2 cursor-pointer"
      >
        Back to Todo List
      </button>

      <ToastContainer />
    </section>
  );
};

export default TodoDetails;