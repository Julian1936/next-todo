import { NextRequest, NextResponse } from "next/server";
import { hygraphFetch } from "@/app/lib/hygraph";
import { GET_NAV_PAGES_QUERY } from "@/app/lib/queries/getPage";

interface NavPage {
  id: string;
  pageTitle: string;
  pageUrl: string;
}

interface NavPagesData {
  pages: NavPage[];
}

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale");

  if (!locale) {
    return NextResponse.json(null, { status: 400 });
  }

  try {
    const data = await hygraphFetch<NavPagesData>(GET_NAV_PAGES_QUERY, {
      locale: [locale],
    });

    return NextResponse.json(data.pages);
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
