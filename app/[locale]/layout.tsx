// app/[locale]/layout.tsx
import { getMessages } from "next-intl/server";
import Providers from "../providers";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <Providers locale={locale} messages={messages}>
      <Header />
      <main className="px-6 py-4 grow">{children}</main>
      <Footer />
    </Providers>
  );
}
