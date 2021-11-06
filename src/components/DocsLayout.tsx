import Icon from "@chakra-ui/icon";
import {
  Box,
  Flex,
  HStack,
  List,
  ListItem,
  Spacer,
  Text
} from "@chakra-ui/layout";
import { IconButton } from "@chakra-ui/react";
import { Github } from "@emotion-icons/boxicons-logos";
import { Bulb } from "@emotion-icons/boxicons-regular";
import NextLink from "next/link";
import type { Doc } from "../docs";
import { ActiveLink } from "./ActiveLink";
import { FeedbackButton } from "./FeedbackButton";

type Props = {
  children: React.ReactNode;
  allDocs: Doc[];
};

function DocsLayout({ children, allDocs }: Props) {
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
        <NextLink href="https://github.com/nimobeeren/webtex" passHref>
          <IconButton
            as="a"
            aria-label="View the source code on GitHub"
            title="View the source code on GitHub"
            icon={<Icon as={Github} />}
            colorScheme="blue"
            variant="ghost"
            size="sm"
            fontSize="3xl"
          />
        </NextLink>
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
          <Box
            as="main"
            flexGrow={1}
            maxW={720}
            m="0 auto"
            px={8}
            sx={{
              p: {
                my: 4
              },
              a: {
                color: "blue.600",
                ":hover": {
                  // must be in :hover to fix specificity
                  textDecorationColor: "blue.100",
                  textUnderlineOffset: "3px"
                }
              }
            }}
          >
            {children}
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