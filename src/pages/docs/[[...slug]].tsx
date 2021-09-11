import { GetStaticPaths, GetStaticProps } from "next";
import ErrorPage from "next/error";
import React from "react";
import { getAllDocSlugs, getDocBySlug } from "../../docs";
import { processor } from "../../markdown/processor-docs";

function Docs({ docHtml }) {
  if (!docHtml) {
    return <ErrorPage statusCode={404} />;
  }
  return <div dangerouslySetInnerHTML={{ __html: docHtml }} />;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug?.[0] || "index";

  const doc = getDocBySlug(slug);
  const docHtml = (await processor.process(doc)).toString();

  return {
    props: {
      docHtml
    }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllDocSlugs();
  // TODO: Styles are wrong because we're not
  // using chakra's components (check if one of the unified plugins can help)
  return {
    paths: slugs.map((slug) => ({
      params: { slug: slug === "index" ? [] : [slug] }
    })),
    fallback: false
  };
};

export default Docs;
