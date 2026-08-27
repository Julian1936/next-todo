"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function ProfileForm() {
  const { data: session, update } = useSession();
  const [firstName, setFirstName] = useState(session?.user?.firstName ?? "");
  const [lastName, setLastName] = useState(session?.user?.lastName ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName }),
    });

    if (res.ok) {
      await update({ firstName, lastName });
    }

    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-10">
      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" className="border rounded px-3 py-2 flex-1" />
      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" className="border rounded px-3 py-2 flex-1" />
      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
