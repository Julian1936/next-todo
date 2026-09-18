"use client";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

export default function Providers({ children, locale, messages }: { children: ReactNode; locale: string; messages: Record<string, unknown> }) {
  return (
    <SessionProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
