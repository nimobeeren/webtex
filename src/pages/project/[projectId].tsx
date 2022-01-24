import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  IconButton,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useTheme
} from "@chakra-ui/react";
import { ArrowBack, Printer } from "@emotion-icons/boxicons-regular";
import { Book, Edit } from "@emotion-icons/boxicons-solid";
import { useThrottleCallback } from "@react-hook/throttle";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { DocsButton } from "../../components/DocsButton";
import { Editor } from "../../components/Editor";
import { FeedbackButton } from "../../components/FeedbackButton";
import { GitHubButton } from "../../components/GitHubButton";
import { Header } from "../../components/Header";
import { Preview, PreviewPlaceholder } from "../../components/Preview";
import { processor } from "../../services/markdown/processor";
import { trpc } from "../../utils/trpc";

const RENDER_THROTTLE_FPS = 10;
const SAVE_THROTTLE_FPS = 1;

function ProjectPage() {
  const { query } = useRouter();
  const projectId = query.projectId as string;

  // TODO: draft project
  // TODO: error handling such as 404

  const projectQuery = trpc.useQuery(["project", { id: projectId }], {
    onError: (error) => {
      const message = `Oops, something went wrong when loading the project:\n${error.message}`;
      console.error(message);
      // Never overwrite the local state with server state
      if (content === undefined && bibliography === undefined) {
        setContent(message);
        setBibliography(message);
      }
    },
    onSuccess: (project) => {
      // Never overwrite the local state with server state
      if (content === undefined && bibliography === undefined) {
        setContent(project.content);
        setBibliography(project.bibliography);
      }
    }
  });
  const updateProjectMutation = trpc.useMutation(["updateProject"]);

  const [content, setContent] = useState(
    projectQuery.isSuccess ? projectQuery.data.content : undefined
  );
  const [bibliography, setBibliography] = useState(
    projectQuery.isSuccess ? projectQuery.data.bibliography : undefined
  );
  const [output, setOutput] = useState<JSX.Element | null>(null);

  const previewRef = useRef<HTMLIFrameElement>(null);
  const theme = useTheme();

  function renderDocument(content: string, bibliography: string) {
    const startTime = performance.now();

    processor
      // Store the bibliography as a data attribute on the virtual file, because
      // it's not part of the markdown, but it is still needed to create citations
      .process({ value: content, data: { bibliography } })
      .then((vfile) => {
        const endTime = performance.now();
        console.debug(`Processing time: ${Math.round(endTime - startTime)}ms`);
        if (vfile.value === "") {
          // Input was empty
          setOutput(null);
        } else {
          setOutput(vfile.result as JSX.Element);
        }
      })
      .catch((err) => {
        console.error(err);
        setOutput(<p>{String(err)}</p>);
      });
  }

  function saveDocument(content: string, bibliography: string) {
    updateProjectMutation.mutate({ id: projectId, content, bibliography });
  }

  const throttledRenderDocument = useThrottleCallback(
    renderDocument,
    RENDER_THROTTLE_FPS,
    true // run on leading and trailing edge
  );

  const throttledSaveDocument = useThrottleCallback(
    saveDocument,
    SAVE_THROTTLE_FPS
  );

  // Things to do when the source code of the document is changed
  useEffect(() => {
    if (content !== undefined && bibliography !== undefined) {
      throttledRenderDocument(content, bibliography);
      throttledSaveDocument(content, bibliography);
    }
  }, [content, bibliography, throttledRenderDocument, throttledSaveDocument]);

  return (
    <Flex width="100%" height="100vh" position="relative">
      <Head>
        <title>WebTeX</title>
      </Head>
      {projectQuery.isLoading && (
        <Center position="absolute" top={42} left={0} right={0} bottom={0}>
          <Spinner size="xl" />
        </Center>
      )}
      <Box flex="1 0 0">
        <Tabs
          id="editor-tabs" // added to fix rehydration id mismatch
          display="flex"
          flexDir="column"
          height="100%"
        >
          <HStack
            spacing={2}
            h={42}
            px={2}
            borderBottom="2px"
            borderColor="gray.200"
          >
            <NextLink href="/projects" passHref>
              <IconButton
                aria-label="Go back to the project list"
                title="Go back to the project list"
                icon={<ArrowBack />}
                variant="ghost"
                size="sm"
                p={1}
              />
            </NextLink>
            <TabList borderBottom="none">
              <Tab isDisabled={projectQuery.isLoading}>
                <Icon as={Edit} mr={2} />
                Content
              </Tab>
              <Tab isDisabled={projectQuery.isLoading}>
                <Icon as={Book} mr={2} />
                Bibliography
              </Tab>
            </TabList>
          </HStack>

          {!projectQuery.isLoading && (
            <TabPanels
              height="100%"
              _focusWithin={{
                boxShadow: `inset ${theme.shadows.outline}`
              }}
              transitionDuration="normal"
            >
              <TabPanel p={0} height="100%" tabIndex={-1}>
                <Editor
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Enter Markdown here"
                  height="100%"
                />
              </TabPanel>
              <TabPanel p={0} height="100%" tabIndex={-1}>
                <Editor
                  value={bibliography}
                  onChange={(event) => setBibliography(event.target.value)}
                  placeholder="Enter BibTeX here"
                  height="100%"
                />
              </TabPanel>
            </TabPanels>
          )}
        </Tabs>
      </Box>
      <Flex flex="1 0 0" direction="column">
        <Header justify="flex-end">
          <NextLink href="/docs" passHref>
            {/* @ts-expect-error target prop is not recognized even though it's rendered as an <a> */}
            <DocsButton as="a" target="_blank" />
          </NextLink>
          <Button
            onClick={() => {
              if (previewRef.current?.contentWindow) {
                previewRef.current.contentWindow.print();
              } else {
                console.error("Could not print document");
              }
            }}
            leftIcon={<Icon as={Printer} />}
            variant="ghost"
            size="sm"
            isDisabled={projectQuery.isLoading}
          >
            Print
          </Button>
          <FeedbackButton variant="ghost" />
          <NextLink href="https://github.com/nimobeeren/webtex" passHref>
            {/* @ts-expect-error anchor props are not recognized even though it's rendered as an <a> */}
            <GitHubButton as="a" target="_blank" />
          </NextLink>
        </Header>
        {!projectQuery.isLoading && (
          <Box flexGrow={1} borderLeft="2px" borderColor="gray.200">
            {output ? (
              <Preview
                ref={previewRef}
                width="100%"
                height="100%"
                overflowY="auto"
              >
                {output}
              </Preview>
            ) : (
              <Center p={8} width="100%" height="100%">
                <PreviewPlaceholder />
              </Center>
            )}
          </Box>
        )}
      </Flex>
    </Flex>
  );
}

export default ProjectPage;
