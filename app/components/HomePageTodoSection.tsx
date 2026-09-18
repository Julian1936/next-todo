"use client";

import { useSession, signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import TodoCalendar from "./TodoCalendar";

export default function HomeTodoSection() {
  const t = useTranslations("HomePageLogin");
  const { data: session } = useSession();

  return session?.user ? (
    <TodoCalendar />
  ) : (
    <>
      <p>{t("loginMessage")}</p>
      <button onClick={() => signIn()} className="mt-5 border rounded px-2 py-1 hover:bg-gray-50">
        {t("signInButton")}
      </button>
    </>
  );
}
