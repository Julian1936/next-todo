import { notFound } from "next/navigation";
import PageTitle from "@/app/components/PageTitle";
import { hygraphFetch } from "@/app/lib/hygraph";
import { GET_PAGE_QUERY, GET_ALL_PAGE_SLUGS_QUERY } from "@/app/lib/queries/getPage";

interface PageEntry {
  pageTitle: string;
  pageSubtitle: string;
  pageUrl: string;
  pageContent: { html: string } | null;
  localizations: { locale: string; pageUrl: string }[];
}

interface PageData {
  pages: PageEntry[];
}

interface SlugEntry {
  pageUrl: string;
  locale: string;
  localizations: { locale: string; pageUrl: string }[];
}

interface AllSlugsData {
  pages: SlugEntry[];
}

// Pre-build every locale/slug combination at build time
export async function generateStaticParams() {
  const data = await hygraphFetch<AllSlugsData>(GET_ALL_PAGE_SLUGS_QUERY);

  const params: { locale: string; slug: string }[] = [];

  for (const page of data.pages) {
    // the entry's own locale + slug
    params.push({ locale: page.locale, slug: page.pageUrl });
    // each of its translations
    for (const loc of page.localizations) {
      params.push({ locale: loc.locale, slug: loc.pageUrl });
    }
  }

  return params;
}

export default async function CmsPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;

  const data = await hygraphFetch<PageData>(GET_PAGE_QUERY, {
    pageUrl: slug,
    locale: [locale],
  });

  const page = data.pages?.[0];

  if (!page) {
    notFound();
  }

  return (
    <>
      <PageTitle title={page.pageTitle} subTitle={page.pageSubtitle} />
      {page.pageContent?.html && <div className="prose" dangerouslySetInnerHTML={{ __html: page.pageContent.html }} />}
    </>
  );
}
