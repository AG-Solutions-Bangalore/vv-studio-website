export { cn } from "cn"

/**
 * Repeat list items until `minCount` is reached, so carousels/marquees
 * stay full and loop seamlessly when the backend returns few rows.
 * `withKey` must give every repeated copy a unique key (copies beyond
 * the first get `copyIndex >= 1`).
 */
export function repeatToCount<T>(
  items: T[],
  minCount: number,
  withKey: (item: T, copyIndex: number) => T,
): T[] {
  if (items.length === 0 || items.length >= minCount) return items;
  const filled: T[] = [];
  let i = 0;
  while (filled.length < minCount) {
    filled.push(withKey(items[i % items.length], Math.floor(i / items.length)));
    i += 1;
  }
  return filled;
}
