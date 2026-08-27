"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Navigation() {
  const { data: session } = useSession();
  return (
    <nav>
      <ul className="flex items-center gap-3">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        {session?.user && (
          <li>
            <Link href="/profile">Profile</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
