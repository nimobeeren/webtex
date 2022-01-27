import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  IconButton,
  Spacer,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useTheme
} from "@chakra-ui/react";
import {
  ArrowBack,
  Check,
  CloudUpload,
  Error as ErrorIcon,
  Printer
} from "@emotion-icons/boxicons-regular";
import { Book, Edit } from "@emotion-icons/boxicons-solid";
import { useThrottleCallback } from "@react-hook/throttle";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { DocsButton } from "../../components/DocsButton";
import { Editor } from "../../components/Editor";
import { FeedbackButton } from "../../components/FeedbackButton";
import { GitHubButton } from "../../components/GitHubButton";
import { Header } from "../../components/Header";
import { Preview, PreviewPlaceholder } from "../../components/Preview";
import { TimeAgo } from "../../components/TimeAgo";
import { processor } from "../../services/markdown/processor";
import { trpc } from "../../utils/trpc";

const RENDER_THROTTLE_FPS = 10;
const SAVE_THROTTLE_FPS = 1;

function ProjectPage() {
  const { query } = useRouter();
  const projectId = query.projectId as string;

  // TODO: draft project
  // TODO: error handling such as 404

  const queryClient = useQueryClient();
  // TODO: disable the query after initial load of project?
  const projectQuery = trpc.useQuery(["project", { id: projectId }], {
    onError: (error) => {
      const message = `Oops, something went wrong when loading the project:\n${error.message}`;
      console.error(message);
    },
    onSuccess: (newProject) => {
      // Never overwrite the local state with server state
      if (content === undefined) {
        setContent(newProject.content);
      }
      if (bibliography === undefined) {
        setBibliography(newProject.bibliography);
      }
    }
  });
  const updateProjectMutation = trpc.useMutation(["updateProject"], {
    // Automatically update the project query data using the mutation response
    onSuccess: (newProject) => {
      queryClient.setQueryData(["project", { id: projectId }], newProject);
    }
  });

  const [content, setContent] = useState(projectQuery.data?.content);
  const [bibliography, setBibliography] = useState(
    projectQuery.data?.bibliography
  );
  const [output, setOutput] = useState<JSX.Element | null>(null);

  const hasUnsavedChanges =
    content !== projectQuery.data?.content ||
    bibliography !== projectQuery.data?.bibliography;

  const previewRef = useRef<HTMLIFrameElement>(null);
  const theme = useTheme();

  function renderProject(content: string, bibliography: string) {
    const startTime = performance.now();
    processor
      // Store the bibliography as a data attribute on the virtual file, because
      // it's not part of the markdown, but it is still needed to create citations
      .process({
        value: content,
        data: { bibliography }
      })
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

  const throttledRenderProject = useThrottleCallback(
    renderProject,
    RENDER_THROTTLE_FPS,
    true // run on leading and trailing edge
  );

  const throttledUpdateProject = useThrottleCallback(
    updateProjectMutation.mutate,
    SAVE_THROTTLE_FPS
  );

  // Render the project when it is changed
  useEffect(() => {
    if (content !== undefined && bibliography !== undefined) {
      throttledRenderProject(content, bibliography);
    }
  }, [content, bibliography, throttledRenderProject]);

  // Update the project when it is changed
  // FIXME: slightly weird behavior when making a change and undoing it quickly
  useEffect(() => {
    if (hasUnsavedChanges) {
      throttledUpdateProject({
        id: projectId,
        content,
        bibliography
      });
    }
  }, [
    projectId,
    content,
    bibliography,
    throttledUpdateProject,
    hasUnsavedChanges
  ]);

  return (
    <Tabs
      id="editor-tabs" // added to fix rehydration id mismatch
      display="flex"
      flexDir="column"
      width="100%"
      height="100%"
    >
      <Head>
        <title>WebTeX</title>
      </Head>
      <Flex direction="column" h="100%">
        <Header>
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
          <Spacer />
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
        {projectQuery.isLoading ? (
          <Center flexGrow={1}>
            <Spinner size="xl" />
          </Center>
        ) : (
          <Flex flexGrow={1}>
            <Box flex="1 0 0">
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
            </Box>
            <Box flex="1 0 0" borderLeft="2px" borderColor="gray.200">
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
          </Flex>
        )}
        <HStack
          as="footer"
          flexShrink={0}
          justify="flex-end"
          h={6}
          px={2}
          spacing={2}
          borderTop="2px"
          borderColor="gray.200"
        >
          {!projectQuery.data ? null : hasUnsavedChanges ? (
            updateProjectMutation.isError ? (
              <>
                <Text id="save-state-label" fontSize="xs" color="gray.700">
                  Failed to save
                </Text>
                <Icon
                  as={ErrorIcon}
                  aria-labelledby="save-state-label"
                  size="xs"
                />
              </>
            ) : (
              <>
                <Text id="save-state-label" fontSize="xs" color="gray.700">
                  Saving...
                </Text>
                <Icon
                  as={CloudUpload}
                  aria-labelledby="save-state-label"
                  size="xs"
                />
              </>
            )
          ) : (
            <>
              <Text id="save-state-label" fontSize="xs" color="gray.700">
                Saved <TimeAgo date={projectQuery.data.updatedAt} />
              </Text>
              <Icon as={Check} aria-labelledby="save-state-label" size="xs" />
            </>
          )}
        </HStack>
      </Flex>
    </Tabs>
  );
}

export default ProjectPage;
