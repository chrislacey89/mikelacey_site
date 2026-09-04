/**
 * Whether this request is Sanity's Presentation tool rendering the site inside
 * its iframe, rather than an ordinary visitor.
 *
 * Extracted because two independent things key off it and they must agree:
 * every page gates its `loadQuery` perspective on it (drafts vs published),
 * and `BaseLayout` gates the Visual Editing runtime on it. If those two
 * diverged, production visitors would download an overlay with no stega data
 * to attach to — the exact combination this predicate exists to prevent.
 */
export function isPreviewRequest(url: URL): boolean {
  return url.searchParams.has('preview') || url.searchParams.has('sanity-preview');
}
