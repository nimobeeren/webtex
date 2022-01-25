import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Spacer,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack
} from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import { DocsButton } from "../components/DocsButton";
import { FeedbackButton } from "../components/FeedbackButton";
import { GitHubButton } from "../components/GitHubButton";
import { Header } from "../components/Header";
import { Logo } from "../components/Logo";
import { trpc } from "../utils/trpc";

function ProjectsPage() {
  const projects = trpc.useQuery(["projects"]);
  if (!projects.data) {
    return <Spinner />;
  }
  return (
      <Flex direction="column" height="100%">
      <Head>
        <title>WebTeX | Projects</title>
      </Head>
        <Header flexShrink={0}>
          <NextLink href="/" passHref>
            <Logo as="a" ml={6} />
          </NextLink>
          <Spacer />
          <NextLink href="/docs" passHref>
            <DocsButton as="a" />
          </NextLink>
          <FeedbackButton variant="ghost" />
          <NextLink href="https://github.com/nimobeeren/webtex" passHref>
            <GitHubButton as="a" />
          </NextLink>
        </Header>
        <Box
          as="main"
          flexGrow={1}
          w="100%"
          maxW={960}
          m="0 auto"
          px={8}
          pt={16}
        >
          <Heading as="h1" mb={8}>
            Projects
          </Heading>
          {projects.data.length == 0 ? (
            <VStack spacing={8} align="flex-start">
              <Text>{"Looks like you haven't saved any projects yet."}</Text>
              <NextLink href="/" passHref>
                <Button as="a">Start writing!</Button>
              </NextLink>
            </VStack>
          ) : (
            <Table size="lg">
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Last changed</Th>
                </Tr>
              </Thead>
              <Tbody>
                {projects.data.map((project) => (
                  <Tr key={project.id} _hover={{ bg: "gray.50" }}>
                    <Td>
                      <NextLink href={`/project/${project.id}`} passHref>
                        <Link>{project.title || "Untitled"}</Link>
                      </NextLink>
                    </Td>
                    <Td>Unknown</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>
      </Flex>
  );
}

export default ProjectsPage;
