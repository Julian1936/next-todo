"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavPage {
  id: string;
  pageTitle: string;
  pageUrl: string;
}

export default function Navigation() {
  const { data: session } = useSession();

  const pathname = usePathname();

  const segments = pathname.split("/");
  const currentLocale = segments[1] || "en";

  const [navPages, setNavPages] = useState<NavPage[]>([]);

  useEffect(() => {
    let ignore = false;

    fetch(`/api/nav-pages?locale=${currentLocale}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((pages) => {
        if (!ignore && pages) setNavPages(pages);
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, [currentLocale]);

  const visibleNavPages = session?.user ? navPages : navPages.slice(0, -1);

  return (
    <nav>
      <ul className="flex items-center gap-3">
        {visibleNavPages.map((page) => (
          <li key={page.id}>
            <Link href={`/${currentLocale}/${page.pageUrl}`}>{page.pageTitle}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
