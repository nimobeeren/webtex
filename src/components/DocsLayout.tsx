import { Box, Flex, List, ListItem, Spacer } from "@chakra-ui/layout";
import Head from "next/head";
import NextLink from "next/link";
import type { Doc } from "../services/docs";
import { ActiveLink } from "./ActiveLink";
import { FeedbackButton } from "./FeedbackButton";
import { GitHubButton } from "./GitHubButton";
import { Header } from "./Header";
import { Logo } from "./Logo";

type Props = {
  children: React.ReactNode;
  allDocs: Doc[];
};

function DocsLayout({ children, allDocs }: Props) {
  return (
    <Flex direction="column" h="100%">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css"
          integrity="sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc"
          crossOrigin="anonymous"
        />
      </Head>
      <Header flexShrink={0}>
        <NextLink href="/" passHref>
          <Logo as="a" ml={6} />
        </NextLink>
        <Spacer />
        <FeedbackButton />
        <NextLink href="https://github.com/nimobeeren/webtex" passHref>
          <GitHubButton as="a" />
        </NextLink>
      </Header>
      <Flex flexGrow={1} minHeight={0}>
        <Box
          as="nav"
          flexShrink={0}
          py={8}
          w={56}
          borderRight="2px"
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
                    {doc.frontmatter.title || doc.slug}
                  </ActiveLink>
                </NextLink>
              </ListItem>
            ))}
          </List>
        </Box>
        <Flex flexGrow={1} overflowY="auto">
          <Box
            as="main"
            flexGrow={1}
            maxW={720}
            m="0 auto"
            px={8}
            pt={16}
            // These CSS rules are applied to the whole subtree
            sx={{
              p: {
                my: 4
              },
              h1: {
                mt: 0,
                mb: 4
              },
              "h2,h3,h4,h5,h6": {
                mt: 12,
                mb: 4
              },
              "ul, ol": {
                // This changes how margin around list items works, and has
                // the side effect of adding some indentation which is nice
                listStylePosition: "inside"
              },
              // This fixes an issue where KaTeX elements cause overflow.
              // The .katex-mathml element is visually hidden but accessible
              // to screen readers. This change could cause issues when
              // focusing the element, but that seems unlikely to happen.
              // See also https://snook.ca/archives/html_and_css/hiding-content-for-accessibility
              ".katex .katex-mathml": {
                top: "-99999px"
              }
            }}
          >
            {children}
            {/* Add a box to act as bottom padding, because bottom padding in
              a container with overflow: auto doesn't really work. */}
            <Box role="presentation" h={16} />
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

export default DocsLayout;
