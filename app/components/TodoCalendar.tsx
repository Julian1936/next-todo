"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import EditTodoForm from "./EditTodoForm";
import AddTodoForm from "./AddTodoForm";

interface Todo {
  id: string;
  todoTitle: string;
  todoDetails?: string;
  todoBy?: string;
  createdAt?: string;
}

function fetchTodosRequest(): Promise<Todo[]> {
  return fetch("/api/todos").then((res) => {
    if (!res.ok) throw new Error("Request failed");
    return res.json();
  });
}

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function buildMonthGrid(year: number, month: number): Date[] {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);

  const lastOfMonth = new Date(year, month + 1, 0);
  const endOffset = 6 - lastOfMonth.getDay();
  const gridEnd = new Date(year, month + 1, lastOfMonth.getDate() + endOffset);

  const days: Date[] = [];
  const cursor = new Date(gridStart);
  while (cursor <= gridEnd) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

export default function TodoCalendar() {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [hasError, setHasError] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [deleteingId, setDeletingID] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const closeModal = useCallback(() => {
    setSelectedTodo(null);
    setIsEditing(false);
    setIsAdding(false);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeModal]);

  useEffect(() => {
    fetchTodosRequest()
      .then((data) => {
        setTodos(data);
        setHasError(false);
      })
      .catch(() => {
        setHasError(true);
      });
  }, []);

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

  const todosByDate = useMemo(() => {
    const map = new Map<string, Todo[]>();
    if (!todos) return map;
    for (const todo of todos) {
      if (!todo.todoBy) continue;
      const parsed = new Date(todo.todoBy);
      if (isNaN(parsed.getTime())) continue;
      const key = toDateKey(parsed);
      const existing = map.get(key);
      if (existing) existing.push(todo);
      else map.set(key, [todo]);
    }
    return map;
  }, [todos]);

  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const days = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  function goToPrevMonth() {
    const prev = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(prev.getFullYear());
    setViewMonth(prev.getMonth());
  }

  function goToNextMonth() {
    const next = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  function goToToday() {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  }

  const isLoading = todos === null && !hasError;

  if (isLoading) {
    return <p>Loading todos...</p>;
  }

  if (hasError) {
    return <p>{"Couldn't load todos!"}</p>;
  }

  const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
  const todayKey = toDateKey(today);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button onClick={goToPrevMonth} aria-label="Previous Month" className="border rounded px-2 py-1 text-sm hover:bg-gray-50">
              ‹
            </button>
            <h2 className="font-semibold text-lg w-40 text-center">{monthLabel}</h2>
            <button onClick={goToNextMonth} aria-label="Next Month" className="border rounded px-2 py-1 text-sm hover:bg-gray-50">
              ›
            </button>
          </div>
          <button onClick={goToToday} className="text-sm border rounded px-2 py-1 hover:bg-gray-50">
            Today
          </button>
          <button onClick={() => setIsAdding(true)} className="text-sm border rounded px-2 py-1 hover:bg-gray-50 ml-auto">
            Add Todo
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200 border rounded overflow-hidden text-sm">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className="bg-gray-50 text-gray-500 font-medium text-center py-1">
              {label}
            </div>
          ))}

          {days.map((day) => {
            const key = toDateKey(day);
            const dayTodos = todosByDate.get(key) ?? [];
            const inCurrentMonth = day.getMonth() === viewMonth;
            const isToday = key === todayKey;

            return (
              <div key={key} className={`min-h-24 bg-white p-1 flex flex-col gap-1 ${inCurrentMonth ? "" : "bg-gray-50 text-gray-400"}`}>
                <span className={`text-xs self-start px-1.5 rounded ${isToday ? "bg-blue-600 text-white font-semibold" : ""}`}>{day.getDate()}</span>
                <div className="flex flex-col gap-1 overflow-y-auto">
                  {dayTodos.map((todo) => (
                    <div
                      key={todo.id}
                      onClick={() => {
                        setSelectedTodo(todo);
                      }}
                      className="text-xs bg-blue-50 text-blue-800 border border-blue-100 rounded px-1 py-0.5 truncate"
                    >
                      {todo.todoTitle}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedTodo && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => closeModal()}>
          <div className="bg-white rounded-lg shadow-lg p-4 w-80 max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            {isEditing ? (
              <EditTodoForm
                todo={selectedTodo}
                onCancel={() => setIsEditing(false)}
                onSaved={(updated) => {
                  setTodos((current) => (current ? current.map((t) => (t.id === updated.id ? updated : t)) : current));
                  setSelectedTodo(updated);
                  setIsEditing(false);
                }}
              />
            ) : (
              <>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold">{selectedTodo.todoTitle}</h3>
                  <button onClick={() => closeModal()} aria-label="Close" className="text-gray-400 hover:text-gray-700">
                    ✕
                  </button>
                </div>
                {selectedTodo.todoDetails && <p className="text-sm text-gray-600 mt-2">{selectedTodo.todoDetails}</p>}
                {selectedTodo.todoBy && <p className="text-sm text-gray-500 mt-2">Due {new Date(selectedTodo.todoBy).toLocaleString()}</p>}
                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={() => setIsEditing(true)} className="text-sm border rounded px-2 py-1 hover:bg-gray-50">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(selectedTodo.id)} disabled={deleteingId === selectedTodo.id} className="text-sm text-red-500 border rounded px-2 py-1 shrink-0">
                    {deleteingId === selectedTodo.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {isAdding && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setIsAdding(false)}>
          <div className="bg-white rounded-lg shadow-lg p-4 w-80 max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start gap-2 mb-2">
              <h3 className="font-semibold">Add a todo</h3>
              <button onClick={() => setIsAdding(false)} aria-label="Close" className="text-gray-400 hover:text-gray-700">
                ✕
              </button>
            </div>
            <AddTodoForm
              onTodoAdded={() => {
                setIsAdding(false);
                fetchTodosRequest()
                  .then((data) => {
                    setTodos(data);
                    setHasError(false);
                  })
                  .catch(() => setHasError(true));
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
