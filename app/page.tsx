"use client";

import { signIn, useSession } from "next-auth/react";
import TodoCalendar from "./components/TodoCalendar";
import PageTitle from "./components/PageTitle";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <>
      <PageTitle title="Next JS Todos" subTitle="Testing a subtitle" />

      {session?.user ? (
        <>
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
