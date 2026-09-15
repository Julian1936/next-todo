const HYGRAPH_ENDPOINT = process.env.HYGRAPH_ENDPOINT!;

export async function hygraphFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(HYGRAPH_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.HYGRAPH_TOKEN && {
        Authorization: `Bearer ${process.env.HYGRAPH_TOKEN}`,
      }),
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  const json = await res.json();

  if (json.errors) {
    console.error(json.errors);
    throw new Error("Failed to fetch from Hygraph");
  }

  return json.data as T;
}
