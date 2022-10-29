import { component$ } from "@builder.io/qwik";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  return (
    <>
      <title>{head.title}</title>

      <link rel="canonical" href={loc.href} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <meta name="description" content="Todo app using the Qwik framework" />
      <meta name="keywords" content="Todo, Todos, Qwik, Josh Hyde" />
      <meta name="author" content="Josh Hyde" />
      <meta
        property="image"
        content="https://avatars.githubusercontent.com/u/40751087?v=4"
      />
      <meta name="og:site_name" content="Qwik Todos" />
      <meta property="type" content="website" />

      <link rel="icon" type="image/svg+xml" href="/check-square.svg" />

      {head.meta.map((m) => (
        <meta {...m} />
      ))}

      {head.links.map((l) => (
        <link {...l} />
      ))}

      {head.styles.map((s) => (
        <style {...s.props} dangerouslySetInnerHTML={s.style} />
      ))}
    </>
  );
});
