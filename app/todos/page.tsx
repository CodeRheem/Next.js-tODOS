

"use client";
import { useState } from "react";
import AddTodosModal from "../../components/addTodos";
import PaginationControls from "../../components/paginationControl";
import Link from "next/link";
import { FaTrashAlt } from "react-icons/fa";
import { useTodos } from "../../hooks/useTodo";
import { Skeleton, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Checkbox } from "@mui/material";
import Head from "next/head";
import Navbar from "@/components/navbar";

function DynamicHead() {
  return (
    <Head>
      <title>Todo List | My Todo App</title>
      <meta name="description" content={`View and manage your todos.`} />
    </Head>
  );
}

const TodosList = () => {
  // Set the page title and meta description using useHead
  DynamicHead();
  // Custom hook to manage todos
  // This hook handles fetching, adding, deleting, and toggling todos
  // It abstracts the logic for managing todos, making the component cleaner
  // and easier to maintain.
  // It also handles loading and error states, providing a better user experience.
  type Todo = {
    id: number;
    todo: string;
    completed: boolean;
  };

  type useTodosReturnType = {
    todos: Todo[];
    isLoading: boolean;
    error: Error | null;
    addTodo: (todo: Todo) => void;
    deleteTodo: (id: number) => void;
    toggleTodo: (id: number) => void;
  };

  const {
    todos,
    isLoading,
    error,
    addTodo,
    deleteTodo,
    toggleTodo,
  }: useTodosReturnType = useTodos();
  // State for search term and pagination
  // This state is used to filter todos based on the search term
  const [searchTerm, setSearchTerm] = useState("");
  // State for current page in pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completionFilter, setCompletionFilter] = useState("all");
  const todosPerPage = 10; // Number of todos per page

  interface NewTodo {
    todo: string;
    completed?: boolean;
  }

  const handleAddTodo = (newTodo: NewTodo): void => {
    if (!newTodo.todo || newTodo.todo.trim() === "") {
      console.error("Todo title is required");
      return;
    }

    addTodo(newTodo as Todo);
    setSearchTerm("");
  };

  const handleDelete = (id: number) => {
    deleteTodo(id);
  };

  const handleToggleComplete = (id: number) => {
    toggleTodo(id);
  };

  const handleFilterChange = (
    _: React.MouseEvent<HTMLElement>,
    newFilter: string | null,
  ) => {
    if (newFilter !== null) {
      setCompletionFilter(newFilter);
      setCurrentPage(1); // Reset to first page when filter changes
    }
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.todo
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      completionFilter === "all"
        ? true
        : completionFilter === "complete"
          ? todo.completed
          : !todo.completed;

    return matchesSearch && matchesFilter;
  });

  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return (
      <main className="p-4">
        <header>
          <Skeleton variant="text" width={200} height={40} className="mb-4" />
        </header>

        <section aria-label="Todo controls">
          <Skeleton variant="rectangular" height={40} className="mb-4" />
          <Skeleton variant="rectangular" height={40} className="mb-4" />
          <Skeleton variant="rectangular" width={120} height={40} />
        </section>

        <section aria-label="Todo list">
          <ul className="flex flex-col gap-4 mt-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 border-b border-gray-300"
              >
                <div className="flex items-center">
                  <Skeleton
                    variant="circular"
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  <Skeleton variant="text" width={200} />
                </div>
                <Skeleton variant="circular" width={24} height={24} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    );
  }

  if (error) return <p>Error: {error.message}</p>;

  return (
    <header>
      <Navbar />
      <main className="p-4">
        <Head>
          <title>Todo List | My Todo App</title>
          <meta name="description" content="View and manage your todos." />
        </Head>
        <h1 className="text-2xl font-bold mb-4 font-serif">Todo List</h1>

        <section aria-label="Todo controls">
          {/* Search Input */}
          <div className="mb-4">
            <label htmlFor="search-todos" className="sr-only">
              Search todos
            </label>
            <input
              id="search-todos"
              type="search"
              placeholder="Search todos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md font-serif"
              aria-label="Search todos"
            />
          </div>

          {/* Completion Status Filter */}
          <div className="mb-4">
            <ToggleButtonGroup
              value={completionFilter}
              exclusive
              onChange={handleFilterChange}
              aria-label="todo completion filter"
              className="w-full"
            >
              <ToggleButton value="all" aria-label="show all todos">
                All
              </ToggleButton>
              <ToggleButton value="complete" aria-label="show completed todos">
                Completed
              </ToggleButton>
              <ToggleButton
                value="incomplete"
                aria-label="show incomplete todos"
              >
                Incomplete
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

          {/* Add Todo Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#7127b5] text-white px-4 py-2 rounded-md hover:bg-[#551c89] font-serif font-semibold cursor-pointer"
            aria-label="Add new todo"
          >
            Add Todo
          </button>
        </section>

        {/* Add Todos Modal */}
        <AddTodosModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          addTodo={handleAddTodo}
        />

        {/* Todos List */}
        <section aria-label="Todo list">
          <ul className="flex flex-col gap-4 mt-4 font-serif">
            {currentTodos.map((todo) => (
              <li
                key={todo.id}
                className="flex justify-between items-center p-2 border-b border-gray-300"
              >
                <div className="flex items-center">
                  <Checkbox
                    name="todo-checkbox"
                    aria-label={`Toggle completion for ${todo.todo}`}
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo.id)}
                    sx={{
                      "& .MuiSvgIcon-root": {
                        color: "#9f54d6",
                      },
                      "&.Mui-checked .MuiSvgIcon-root": {
                        color: "#551c89",
                      },
                      "&.MuiCheckbox-root": {
                        color: "#9f54d6",
                      },
                    }}
                  />
                  <Link
                    href={`/todos/${todo.id}`}
                    className={`ml-2 flex-1 ${
                      todo.completed ? "line-through text-gray-500" : ""
                    }`}
                    aria-label={`View details for ${todo.todo}`}
                  >
                    {todo.todo}
                  </Link>
                </div>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="bg-transparent text-white px-4 py-2 rounded-md hover:bg-red-400 font-serif"
                  aria-label={`Delete todo ${todo.todo}`}
                  title={`Delete todo ${todo.todo}`}
                >
                  <span className="sr-only">Delete</span>
                  <FaTrashAlt className="text-white cursor-pointer" />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Pagination Controls */}
        <nav aria-label="Todo list pagination">
          <PaginationControls
            currentPage={currentPage}
            totalPages={Math.ceil(filteredTodos.length / todosPerPage)}
            onPageChange={handlePageChange}
          />
        </nav>
      </main>
    </header>
  );
};

export default TodosList;