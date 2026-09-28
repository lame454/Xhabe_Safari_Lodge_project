/**
 * Renders a schema.org graph as a JSON-LD script tag.
 *
 * Server component by design: this markup exists for crawlers, and a crawler
 * that does not run JavaScript has to find it in the delivered HTML. Rendering
 * it on the client would defeat the entire point.
 *
 * The `<` escape below is not optional. A string containing the literal text
 * `</script>` would otherwise close the tag early and the remainder would be
 * parsed as HTML, which is the standard way JSON-LD becomes an injection
 * vector. Today every value comes from the repo's own constants, so there is
 * nothing hostile to escape, but this component has no way to enforce that
 * about its future callers and the fix costs one `replace`.
 */
export default function JsonLd({ schema }: { schema: object | object[] }) {
  const json = JSON.stringify(schema).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // Safe: serialised from a plain object, with `<` neutralised above.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
