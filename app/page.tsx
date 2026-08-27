"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import TodoCalendar from "./components/TodoCalendar";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-5">NextJS Todos</h1>

      {session?.user ? (
        <>
          <div className="flex align-center gap-5 mb-4">
            <p>Signed in as {session.user.email}</p>
            <button onClick={() => signOut()}>Sign Out</button>
          </div>
          <TodoCalendar />
        </>
      ) : (
        <>
          <p>Login to add and view current tasks</p>
          <button onClick={() => signIn()}>Sign In</button>
        </>
      )}
    </>
  );
}
