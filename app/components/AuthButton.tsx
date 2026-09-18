"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function AuthButton() {
  const t = useTranslations("HeaderLogin");
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <p className="hidden sm:block">
          {t("loggedInMessage")} {session?.user?.firstName && session?.user?.lastName ? `${session.user.firstName} ${session.user.lastName}` : session?.user?.email}
        </p>
        <button onClick={() => signOut()} className="text-sm border rounded px-2 py-1 hover:bg-gray-50">
          {t("signOutButton")}
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn()} className="text-sm border rounded px-2 py-1 hover:bg-gray-50">
      {t("signInButton")}
    </button>
  );
}
