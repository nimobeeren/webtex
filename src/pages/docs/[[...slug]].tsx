import { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import ErrorPage from "next/error";
import React from "react";
import { getAllDocSlugs, getDocBySlug } from "../../docs";
import { components } from "../../mdxComponents";

function DocsPage({ source }) {
  if (!source) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <div>
      <MDXRemote {...source} components={components} />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug?.[0] || "index";

  const doc = getDocBySlug(slug);
  const mdxSource = await serialize(doc);

  return {
    props: {
      source: mdxSource
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
