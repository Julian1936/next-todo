"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <p>Signed in as {session?.user?.firstName && session?.user?.lastName ? `${session.user.firstName} ${session.user.lastName}` : session?.user?.email}</p>
        <button onClick={() => signOut()} className="text-sm border rounded px-2 py-1 hover:bg-gray-50">
          Sign Out
        </button>
      </div>
    );
  }

  return <button onClick={() => signIn()}>Sign In</button>;
}
