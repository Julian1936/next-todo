"use client";

import { useState } from "react";

interface AddTodoFormProps {
  onTodoAdded?: () => void;
}

export default function AddTodoForm({ onTodoAdded }: AddTodoFormProps) {
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDetails, setTodoDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!todoTitle.trim()) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todoTitle, todoDetails }),
      });
      if (!res.ok) throw new Error("Request failed");
      setTodoTitle("");
      setTodoDetails("");
      setStatus("idle");
      onTodoAdded?.();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input value={todoTitle} onChange={(e) => setTodoTitle(e.target.value)} placeholder="Add a todo..." className="border rounded px-3 py-2 flex-1" />
      <textarea value={todoDetails} onChange={(e) => setTodoDetails(e.target.value)} placeholder="Details (optional)" className="border rounded px-3 py-2" rows={3} />
      <button type="submit" disabled={status === "loading"} className="border rounded px-4 py-2">
        {status === "loading" ? "Adding..." : "Add"}
      </button>
      {status === "error" && <p className="text-red-500 text-sm">Something went wrong.</p>}
    </form>
  );
}
