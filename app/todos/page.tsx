"use client";
import { useState } from "react";
import AddTodoForm from "../components/AddTodoForm";
import TodoList from "../components/TodoList";

export default function AboutPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <h1>About</h1>
      <AddTodoForm onTodoAdded={() => setRefreshKey((k) => k + 1)} />
      <TodoList refreshKey={refreshKey} />
    </>
  );
}
