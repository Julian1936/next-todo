import { NextRequest, NextResponse } from "next/server";
import { hygraphFetch } from "@/app/lib/hygraph";
import { GET_PAGE_QUERY } from "@/app/lib/queries/getPage";

interface PageData {
  pages: {
    pageUrl: string;
    localizations: { locale: string; pageUrl: string }[];
  }[];
}

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale");
  const slug = request.nextUrl.searchParams.get("slug");

  if (!locale || !slug) {
    return NextResponse.json(null, { status: 400 });
  }

  try {
    const data = await hygraphFetch<PageData>(GET_PAGE_QUERY, {
      pageUrl: slug,
      locale: [locale],
    });

    const page = data.pages?.[0];
    if (!page) {
      return NextResponse.json(null, { status: 404 });
    }

    const map: Record<string, string> = { [locale]: page.pageUrl };
    for (const loc of page.localizations) {
      map[loc.locale] = loc.pageUrl;
    }

    return NextResponse.json(map);
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
