import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useTheme
} from "@chakra-ui/react";
import { Printer } from "@emotion-icons/boxicons-regular";
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

const STORAGE_KEY_SOURCE = "saved-source-v1";
const RENDER_THROTTLE_FPS = 10;
const SAVE_THROTTLE_FPS = 1;

function loadSource() {
  if (typeof window === "undefined") {
    return undefined;
  }
  const json = window.localStorage.getItem(STORAGE_KEY_SOURCE);
  if (json === null) {
    return undefined;
  }
  try {
    const { content, bibliography } = JSON.parse(json);
    return { content, bibliography };
  } catch {
    console.warn(
      `Got unexpected value from storage (key "${STORAGE_KEY_SOURCE}"), value:\n"${json}"`
    );
    return undefined;
  }
}

function saveSource(content: string, bibliography: string) {
  if (typeof window === "undefined") {
    return undefined;
  }
  const state = JSON.stringify({ content, bibliography });
  window.localStorage.setItem(STORAGE_KEY_SOURCE, state);
}

function ProjectPage() {
  const { query } = useRouter();
  const projectId = query.projectId as string;

  // LEFT HERE:
  // First idea was to replace content and bibliography state with react-query
  // queries, but that doens't really work because we still need to keep local
  // state.
  // The challenge will be to keep app state/localStorage/db in sync.
  // Maybe the next easiest step would be to rely fully on the db, then add back
  // localStorage.

  // TODO: draft project
  // TODO: error handling such as 404

  const projectQuery = trpc.useQuery(["project", { id: projectId }], {
    onError: (error) => {
      const message = `Oops, something went wrong when loading the project:\n${error.message}`;
      setContent(message);
      setBibliography(message);
    },
    onSuccess: (project) => {
      setContent(project.content);
      setBibliography(project.bibliography);
    }
  });

  const [content, setContent] = useState(
    projectQuery.isSuccess ? projectQuery.data.content : undefined
  );
  const [bibliography, setBibliography] = useState(
    projectQuery.isSuccess ? projectQuery.data.bibliography : undefined
  );
  const [output, setOutput] = useState<JSX.Element | null>(null);

  const previewRef = useRef<HTMLIFrameElement>(null);

  const theme = useTheme();

  function renderSource(content: string, bibliography: string) {
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

  // TODO: change "source" to "document"?
  const throttledRenderSource = useThrottleCallback(
    renderSource,
    RENDER_THROTTLE_FPS,
    true // run on leading and trailing edge
  );

  const throttledSaveSource = useThrottleCallback(
    saveSource,
    SAVE_THROTTLE_FPS
  );

  // Things to do when the source code of the document is changed
  useEffect(() => {
    if (content !== undefined && bibliography !== undefined) {
      throttledRenderSource(content, bibliography);
      // throttledSaveSource(content, bibliography); TODO
    }
  }, [content, bibliography, throttledRenderSource, throttledSaveSource]);

  console.log(projectQuery.isLoading);
  console.log(projectQuery.data);

  if (projectQuery.isLoading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Flex width="100%" height="100vh" position="relative">
      <Head>
        <title>WebTeX</title>
      </Head>
      <Box flex="1 0 0">
        <Tabs
          id="editor-tabs" // added to fix rehydration id mismatch
          display="flex"
          flexDir="column"
          height="100%"
        >
          <TabList>
            <Tab>
              <Icon as={Edit} mr={2} />
              Content
            </Tab>
            <Tab>
              <Icon as={Book} mr={2} />
              Bibliography
            </Tab>
          </TabList>

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
        </Tabs>
      </Box>
      <Flex flex="1 0 0" direction="column">
        {/* Similar style as the <TabList /> */}
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
          >
            Print
          </Button>
          <FeedbackButton variant="ghost" />
          <NextLink href="https://github.com/nimobeeren/webtex" passHref>
            {/* @ts-expect-error anchor props are not recognized even though it's rendered as an <a> */}
            <GitHubButton as="a" target="_blank" />
          </NextLink>
        </Header>
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
      </Flex>
    </Flex>
  );
}

export default ProjectPage;