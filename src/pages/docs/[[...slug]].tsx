import {
  Box,
  Flex,
  HStack,
  Link,
  List,
  ListItem,
  Spacer,
  Text
} from "@chakra-ui/layout";
import { Icon, IconButton } from "@chakra-ui/react";
import { Github } from "@emotion-icons/boxicons-logos";
import { Bulb } from "@emotion-icons/boxicons-regular";
import { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import ErrorPage from "next/error";
import NextLink from "next/link";
import React from "react";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkSlug from "remark-slug";
import { ActiveLink } from "../../components/ActiveLink";
import { FeedbackButton } from "../../components/FeedbackButton";
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
    <Flex direction="column" h="100vh">
      <HStack
        as="header"
        flexShrink={0}
        align="center"
        spacing={2}
        h={42}
        pl={8}
        pr={2}
        borderBottom="1px"
        borderColor="gray.200"
      >
        <NextLink href="/" passHref>
          <Text
            as="a"
            fontSize="xl"
            fontWeight={700}
            whiteSpace="nowrap"
            lineHeight="none"
          >
            WebTeX
          </Text>
        </NextLink>
        <Spacer />
        <FeedbackButton
          leftIcon={<Icon as={Bulb} />}
          colorScheme="blue"
          variant="solid"
          size="sm"
        >
          Give us Feedback
        </FeedbackButton>
        <Link href="https://github.com/nimobeeren/webtex" passHref>
          <IconButton
            as="a"
            target="_blank"
            rel="noopener"
            aria-label="View the source code on GitHub"
            title="View the source code on GitHub"
            icon={<Icon as={Github} />}
            colorScheme="blue"
            variant="ghost"
            size="sm"
            fontSize="3xl"
          />
        </Link>
      </HStack>
      <Flex flexGrow={1} minHeight={0}>
        <Box
          as="nav"
          flexShrink={0}
          py={8}
          w={56}
          borderRight="1px"
          borderColor="gray.200"
        >
          <List>
            {allDocs.map((doc) => (
              <ListItem key={doc.slug} display="block">
                <NextLink
                  href={doc.slug === "index" ? "/docs" : `/docs/${doc.slug}`}
                  passHref
                >
                  <ActiveLink
                    display="block"
                    w="100%"
                    h="100%"
                    px={8}
                    lineHeight="taller"
                    _hover={{
                      background: "blue.50"
                    }}
                    _activeLink={{
                      background: "blue.100"
                    }}
                  >
                    {doc.frontMatter.title || doc.slug}
                  </ActiveLink>
                </NextLink>
              </ListItem>
            ))}
          </List>
        </Box>
        <Flex py={16} flexGrow={1} overflowY="auto">
          <Box as="main" flexGrow={1} maxW={720} m="0 auto" px={8}>
            <MDXRemote {...source} components={components} />
          </Box>
          <Box
            flexShrink={0}
            display={["none", null, null, null, "block"]}
            w={56}
          />
        </Flex>
      </Flex>
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
      // FIXME: KaTeX doesn't work yet
      // FIXME: raw HTML doesn't work yet
      // TODO: also would be nice to set up next-remote-watch, see https://github.com/vercel/next.js/tree/canary/examples/with-mdx-remote
      remarkPlugins: [remarkSlug, remarkGfm, remarkMath],
      rehypePlugins: [rehypeRaw, rehypeKatex]
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
