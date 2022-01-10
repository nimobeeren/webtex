import { Flex, Spacer, Spinner } from "@chakra-ui/react";
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
    <>
      <Head>
        <title>WebTeX | Projects</title>
      </Head>
      <Flex direction="column" height="100vh">
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
      </Flex>
    </>
  );
}

export default ProjectsPage;
