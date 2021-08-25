import { merge } from "lodash-es";
import React from "react";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkSlug from "remark-slug";
import { unified } from "unified";
import rehypeFigure from "./rehype-figure";
import remarkCite from "./remark-cite";
import remarkCrossReference from "./remark-cross-reference";
import remarkCustomId from "./remark-custom-id";

export const processor = unified()
  .use(remarkParse)
  // @ts-expect-error
  .use(remarkSlug)
  .use(remarkCustomId)
  .use(remarkCrossReference)
  .use(remarkDirective)
  .use(remarkCite)
  .use(remarkMath)
  .use(remarkRehype, { allowDangerousHtml: true })
  // @ts-expect-error
  .use(rehypeRaw)
  .use(rehypeFigure)
  // @ts-expect-error
  .use(rehypeExternalLinks)
  // @ts-expect-error
  .use(rehypeKatex)
  .use(
    // @ts-expect-error
    rehypeSanitize,
    // Allow class and style attributes on all elements
    merge(defaultSchema, {
      attributes: { "*": ["className", "style"] },
      clobberPrefix: "", // don't clobber (i.e. prefix) any attribute values
      // Allow the `about` protocol on href attributes, this is needed for
      // rehype-link-srcdoc to work
      protocols: {
        href: [...defaultSchema.protocols!.href, "about"]
      }
    })
  )
  // @ts-expect-error
  .use(rehypeReact, {
    createElement: React.createElement,
    Fragment: React.Fragment
  });
