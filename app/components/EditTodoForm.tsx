"use client";

import { useState } from "react";

interface Todo {
  id: string;
  todoTitle: string;
  todoDetails?: string;
  todoBy?: string;
  createdAt?: string;
}

interface EditTodoFormProps {
  todo: Todo;
  onSaved?: (updated: Todo) => void;
  onCancel?: () => void;
}

export default function EditTodoForm({ todo, onSaved, onCancel }: EditTodoFormProps) {
  const [todoTitle, setTodoTitle] = useState(todo.todoTitle);
  const [todoDetails, setTodoDetails] = useState(todo.todoDetails ?? "");
  const [todoBy, setTodoBy] = useState(todo.todoBy ? todo.todoBy.slice(0, 16) : "");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!todoTitle.trim()) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/todos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: todo.id,
          todoTitle,
          todoDetails,
          todoBy: todoBy ? new Date(todoBy).toISOString() : undefined,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      const updated = await res.json();
      setStatus("idle");
      onSaved?.(updated);
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input value={todoTitle} onChange={(e) => setTodoTitle(e.target.value)} className="border rounded px-3 py-2" />
        <input value={todoDetails} onChange={(e) => setTodoDetails(e.target.value)} className="border rounded px-3 py-2" />
        <input type="datetime-local" value={todoBy} onChange={(e) => setTodoBy(e.target.value)} className="border rounded px-3 py-2" />
        <div className="flex gap-2">
          <button type="submit" disabled={status === "loading"} className="border rounded px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 flex-1">
            {status === "loading" ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={onCancel} className="border rounded px-4 py-2 hover:bg-gray-50">
            Cancel
          </button>
        </div>
        {status === "error" && <p className="text-red-500 text-sm">Something went wrong.</p>}
      </form>
    </>
  );
}
