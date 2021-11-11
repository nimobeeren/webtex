import { compile } from "@mdx-js/mdx";
import { useMDXComponents } from "@mdx-js/react";
import { GetStaticPaths, GetStaticProps } from "next";
import ErrorPage from "next/error";
import Head from "next/head";
import { useMemo } from "react";
import * as runtime from "react/jsx-runtime.js";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkSlug from "remark-slug";
import DocsLayout from "../../components/DocsLayout";
import { Doc, getAllDocs, getAllDocSlugs, getDocBySlug } from "../../docs";

/**
 * Synchronously run code.
 *
 * Adapted from https://github.com/mdx-js/mdx/blob/7ff979c8dc2d6f75a6190c84eaffc802e294b0d2/packages/mdx/lib/run.js
 */
function runSync(file: string, options?: any) {
  return new Function(String(file))(options);
}

type StaticProps = {
  compiledMDX?: string;
  frontmatter?: Doc["frontmatter"];
  allDocs: Doc[];
};

function DocsPage({ compiledMDX, frontmatter, allDocs }: StaticProps) {
  const content = useMemo(() => {
    if (compiledMDX) {
      return runSync(compiledMDX, {
        ...runtime,
        useMDXComponents
      });
    } else {
      return null;
    }
  }, [compiledMDX]);

  if (!compiledMDX) {
    return <ErrorPage statusCode={404} />;
  }
  if (!content?.default) {
    return <ErrorPage statusCode={500} />;
  }

  return (
    <DocsLayout allDocs={allDocs}>
      <Head>
        <title>{[frontmatter?.title, 'WebTeX'].join(' | ')}</title>
      </Head>
      <content.default />
    </DocsLayout>
  );
}

export const getStaticProps: GetStaticProps<StaticProps> = async ({
  params
}) => {
  const slug = params?.slug?.[0] || "index";

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
        frontmatter: undefined,
        allDocs
      }
    };
  }

  const compiledMDX = String(
    await compile(doc.content, {
      outputFormat: "function-body",
      providerImportSource: "@mdx-js/react",
      remarkPlugins: [remarkSlug, remarkGfm, remarkMath],
      rehypePlugins: [rehypeKatex]
    })
  );

  return {
    props: {
      compiledMDX,
      frontmatter: doc.frontmatter,
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
