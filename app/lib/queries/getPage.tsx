export const GET_PAGE_QUERY = /* GraphQL */ `
  query GetPage($pageUrl: String!, $locale: [Locale!]!) {
    pages(where: { pageUrl: $pageUrl }, locales: $locale) {
      id
      pageTitle
      pageSubtitle
      pageUrl
      pageContent {
        html
      }
      localizations {
        locale
        pageUrl
      }
    }
  }
`;

// Used by generateStaticParams to build every [locale]/[slug] combination
export const GET_ALL_PAGE_SLUGS_QUERY = /* GraphQL */ `
  query GetAllPageSlugs {
    pages {
      id
      pageUrl
      locale
      localizations {
        locale
        pageUrl
      }
    }
  }
`;

export const GET_NAV_PAGES_QUERY = /* GraphQL */ `
  query GetNavPages($locale: [Locale!]!) {
    pages(where: { showInNav: true }, locales: $locale, orderBy: navOrder_ASC) {
      id
      pageTitle
      pageUrl
      navOrder
    }
  }
`;
