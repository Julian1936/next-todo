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
          <p>{todo.todoTitle}</p>
          {todo.todoDetails && <p>{todo.todoDetails}</p>}
        </li>
      ))}
    </ul>
  );
}
