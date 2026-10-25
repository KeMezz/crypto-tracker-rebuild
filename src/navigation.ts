// CoinPaprika IDs are slugs, never navigation paths or encoded URLs.
export function isCoinId(value: unknown): value is string {
  return typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(value);
}

export function coinPath(coinId: unknown): string {
  if (!isCoinId(coinId)) throw new Error("Invalid coin ID");
  return `/${coinId}`;
}

export function searchTermFromPath(pathname: string): string | undefined {
  const segment = pathname.slice("/search/".length);
  if (!pathname.startsWith("/search/") || !segment || segment.includes("/")) {
    return undefined;
  }
  try {
    // Read the original segment once. Router params can interpret a literal
    // %2F again after decoding %252F, changing the user's search term.
    return decodeURIComponent(segment);
  } catch {
    return undefined;
  }
}
