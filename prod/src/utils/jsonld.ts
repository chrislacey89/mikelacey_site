/**
 * Serializes a JSON-LD graph for embedding via Astro's `set:html`.
 *
 * `set:html` injects raw and performs no escaping, so `JSON.stringify` alone
 * is not enough: a string containing `</script>` closes the block early and
 * the remainder lands in live DOM. Escaping `<` to its native JSON `<`
 * form makes `</` impossible to produce while still round-tripping through
 * `JSON.parse` — unlike HTML-entity escaping, which would hand consumers
 * `Mike &amp; Co`.
 */
export function serializeJsonLd(graph: object): string {
  return JSON.stringify(graph).replace(/</g, '\\u003c');
}
