export const GET_PAGE_QUERY = /* GraphQL */ `
  query GetPage($pageUrl: String!, $locale: [Locale!]!) {
    pages(where: { pageUrl: $pageUrl }, locales: $locale) {
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
      pageUrl
      locale
      localizations {
        locale
        pageUrl
      }
    }
  }
`;
