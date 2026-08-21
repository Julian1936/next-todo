"use client";

import { useState } from "react";

interface AddTodoFormProps {
  onTodoAdded?: () => void;
}

export default function AddTodoForm({ onTodoAdded }: AddTodoFormProps) {
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDetails, setTodoDetails] = useState("");
  const [todoBy, setTodoBy] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!todoTitle.trim()) return;

    setStatus("loading");

    const todoByDate = new Date(todoBy);

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todoTitle, todoDetails, todoBy: todoByDate }),
      });
      if (!res.ok) throw new Error("Request failed");
      setTodoTitle("");
      setTodoDetails("");
      setTodoBy("");
      setStatus("idle");
      onTodoAdded?.();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-10">
      <input value={todoTitle} onChange={(e) => setTodoTitle(e.target.value)} placeholder="Add a todo..." className="border rounded px-3 py-2 flex-1" />
      <textarea value={todoDetails} onChange={(e) => setTodoDetails(e.target.value)} placeholder="Details (optional)" className="border rounded px-3 py-2" rows={3} />
      <input type="datetime-local" value={todoBy} onChange={(e) => setTodoBy(e.target.value)} className="border rounded px-3 py-2" />
      <button type="submit" disabled={status === "loading"} className="border rounded px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 cursor-pointer">
        {status === "loading" ? "Adding..." : "Add"}
      </button>
      {status === "error" && <p className="text-red-500 text-sm">Something went wrong.</p>}
    </form>
  );
}
