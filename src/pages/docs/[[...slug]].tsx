import { Box, Flex, Link, List, ListItem } from "@chakra-ui/layout";
import { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import ErrorPage from "next/error";
import NextLink from "next/link";
import React from "react";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkSlug from "remark-slug";
import { Doc, getAllDocs, getAllDocSlugs, getDocBySlug } from "../../docs";
import { components } from "../../mdxComponents";

type StaticProps = {
  source: MDXRemoteSerializeResult;
  frontMatter: Doc["frontMatter"];
  allDocs: Doc[];
};

function DocsPage({ source, frontMatter, allDocs }: StaticProps) {
  if (!source) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Flex>
      <Box as="nav">
        <List>
          {allDocs.map((doc) => (
            <ListItem key={doc.slug}>
              <NextLink
                href={doc.slug === "index" ? "/docs" : `/docs/${doc.slug}`}
                passHref
              >
                <Link>{doc.frontMatter.title || doc.slug}</Link>
              </NextLink>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box as="main">
        <MDXRemote {...source} components={components} />
      </Box>
    </Flex>
  );
}

export const getStaticProps: GetStaticProps<StaticProps> = async ({
  params
}) => {
  const slug = params?.slug?.[0] || "index";

  const doc = getDocBySlug(slug);
  const allDocs = getAllDocs();

  const mdxSource = await serialize(doc.content, {
    mdxOptions: {
      remarkPlugins: [remarkSlug, remarkGfm],
      rehypePlugins: [rehypeRaw]
    },
    // Allows access to front matter in MDX
    scope: doc.frontMatter
  });

  return {
    props: {
      source: mdxSource,
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
