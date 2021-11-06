import { compile } from "@mdx-js/mdx";
import { useMDXComponents } from "@mdx-js/react";
import { GetStaticPaths, GetStaticProps } from "next";
import ErrorPage from "next/error";
import { useMemo } from "react";
import * as runtime from "react/jsx-runtime.js";
import DocsLayout from "../../components/DocsLayout";
import { Doc, getAllDocs, getAllDocSlugs, getDocBySlug } from "../../docs";

/**
 * Synchronously run code.
 *
 * COPIED FROM:
 * @see https://github.com/mdx-js/mdx/blob/7ff979c8dc2d6f75a6190c84eaffc802e294b0d2/packages/mdx/lib/run.js#L24
 *
 * @param {{toString(): string}} file JS document to run
 * @param {unknown} options
 * @return {*}
 */
function runSync(file, options?) {
  // eslint-disable-next-line no-new-func
  return new Function(String(file))(options);
}

type StaticProps = {
  compiledMDX?: string;
  frontMatter?: Doc["frontMatter"];
  allDocs: Doc[];
};

function DocsPage({ compiledMDX, frontMatter, allDocs }: StaticProps) {
  const { default: Content } = useMemo(() => {
    if (!compiledMDX) return { default: null };
    return runSync(compiledMDX, {
      ...runtime,
      useMDXComponents
    });
  }, [compiledMDX]);

  if (!compiledMDX) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <DocsLayout allDocs={allDocs}>
      <Content />
    </DocsLayout>
  );
}

export const getStaticProps: GetStaticProps<StaticProps> = async ({
  params
}) => {
  const slug = params?.slug?.[0] || "index";

  // TODO: what if doc is not found?
  let doc: Doc | undefined;
  try {
    doc = getDocBySlug(slug);
  } catch (e) {
    if (!(e instanceof Error && e.message.match(/$could not find/i))) {
      throw e;
    }
  }
  const allDocs = getAllDocs();

  if (!doc) {
    return {
      props: {
        compiledMDX: undefined,
        frontMatter: undefined,
        allDocs
      }
    };
  }

  const compiledMDX = String(
    await compile(doc.content, {
      outputFormat: "function-body",
      providerImportSource: "@mdx-js/react"
      // TODO
      // remarkPlugins: [remarkSlug, remarkGfm, remarkMath],
      // rehypePlugins: [rehypeRaw, rehypeKatex]
    })
  );

  return {
    props: {
      compiledMDX,
      frontMatter: doc.frontMatter,
      allDocs
    }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllDocSlugs();
  return {
    paths: slugs.map((slug) => ({
      params: { slug: slug === "index" ? [] : [slug] }
    })),
    fallback: false
  };
};

export default DocsPage;
