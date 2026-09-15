"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

interface SlugMapResult {
  locale: string;
  slug: string;
  map: Record<string, string>;
}

export default function LangSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [result, setResult] = useState<SlugMapResult | null>(null);

  const segments = pathname.split("/");
  const currentLocale = segments[1] || "en";
  const currentSlug = segments[2];

  useEffect(() => {
    if (!currentSlug) return;

    let ignore = false;

    fetch(`/api/page-locales?locale=${currentLocale}&slug=${currentSlug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data) {
          setResult({ locale: currentLocale, slug: currentSlug, map: data });
        }
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, [currentLocale, currentSlug]);

  // Derive whether the fetched result is still relevant to the CURRENT page,
  // rather than imperatively resetting state in the effect.
  const translatedSlugs = result && result.locale === currentLocale && result.slug === currentSlug ? result.map : null;

  function getHrefForLocale(targetLocale: string): string {
    if (targetLocale === currentLocale) return pathname;

    if (currentSlug && translatedSlugs?.[targetLocale]) {
      return `/${targetLocale}/${translatedSlugs[targetLocale]}`;
    }

    const newSegments = [...segments];
    newSegments[1] = targetLocale;
    return newSegments.join("/");
  }

  return (
    <div className="flex gap-2">
      {LOCALES.map(({ code, label }) => (
        <button key={code} onClick={() => router.push(getHrefForLocale(code))} disabled={code === currentLocale} className={code === currentLocale ? "font-bold underline" : "text-blue-600 hover:underline"}>
          {label}
        </button>
      ))}
    </div>
  );
}
