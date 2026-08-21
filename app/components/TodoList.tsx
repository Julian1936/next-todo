"use client";

import { useEffect, useState } from "react";

interface Todo {
  id: string;
  todoTitle: string;
  todoDetails?: string;
  createdAt?: string;
}

interface TodoListProps {
  refreshKey: number;
}

function fetchTodosRequest(): Promise<Todo[]> {
  return fetch("/api/todos").then((res) => {
    if (!res.ok) throw new Error("Request failed");
    return res.json();
  });
}

export default function TodoList({ refreshKey }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [hasError, setHasError] = useState(false);
  const [deleteingId, setDeletingID] = useState<string | null>(null);

  useEffect(() => {
    fetchTodosRequest()
      .then((data) => {
        setTodos(data);
        setHasError(false);
      })
      .catch(() => {
        setHasError(true);
      });
  }, [refreshKey]);

  async function handleDelete(id: string) {
    setDeletingID(id);
    try {
      const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Request Failed");
      setTodos((current) => current && current.filter((todo) => todo.id !== id));
    } catch {
      setHasError(true);
    } finally {
      setDeletingID(null);
    }
  }

  const isLoading = todos === null && !hasError;

  if (isLoading) {
    return <p>Loading todos...</p>;
  }

  if (hasError) {
    return <p>{"Couldn't load todos!"}</p>;
  }

  if (todos && todos.length === 0) {
    return <p>No todos yet.</p>;
  }

  return (
    <ul>
      {todos!.map((todo) => (
        <li key={todo.id}>
          <div>
            <p>{todo.todoTitle}</p>
            {todo.todoDetails && <p>{todo.todoDetails}</p>}
          </div>
          <button onClick={() => handleDelete(todo.id)} disabled={deleteingId === todo.id}>
            {deleteingId === todo.id ? "Deleting..." : "Delete"}
          </button>
        </li>
      ))}
    </ul>
  );
}
