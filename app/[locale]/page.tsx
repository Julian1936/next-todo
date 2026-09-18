import { redirect } from "next/navigation";

const HOME_SLUGS: Record<string, string> = {
  en: "home",
  fr: "accueil",
};

export default async function LocaleRootPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/${HOME_SLUGS[locale] ?? "home"}`);
}
