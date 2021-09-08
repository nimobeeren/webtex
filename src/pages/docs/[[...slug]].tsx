import { GetStaticPaths, GetStaticProps } from "next";
import ErrorPage from "next/error";
import React from "react";
import { getAllDocSlugs, getDocBySlug } from "../../docs";
import { processor } from "../../markdown/processor-docs";

function Docs({ doc }) {
  if (!doc) {
    return <ErrorPage statusCode={404} />;
  }
  return <div dangerouslySetInnerHTML={{ __html: doc }} />;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  console.log({ params });
  if (!params?.slug || !Array.isArray(params.slug)) {
    return { props: {} };
  }

  let doc = getDocBySlug(params.slug?.[0] || "index");
  doc = (await processor.process(doc)).toString();

  return {
    props: {
      doc
    }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllDocSlugs();
  console.log({ slugs });
  // LEFT HERE
  // Index page (/docs) doesn't work yet
  // Other page /docs/test does work, but styles are wrong because we're not
  // using chakra's components (check if one of the unified plugins can help)
  return {
    paths: slugs.map((slug) => ({
      params: { slug: slug === "index" ? [] : [slug] }
    })),
    fallback: false
  };
};

export default Docs;
