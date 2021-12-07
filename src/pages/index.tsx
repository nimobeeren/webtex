import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useTheme
} from "@chakra-ui/react";
import { Github } from "@emotion-icons/boxicons-logos";
import { BookOpen, Bulb, Printer } from "@emotion-icons/boxicons-regular";
import { Book, Edit } from "@emotion-icons/boxicons-solid";
import { useThrottleCallback } from "@react-hook/throttle";
import Head from "next/head";
import NextLink from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Editor } from "../components/Editor";
import { FeedbackButton } from "../components/FeedbackButton";
import { Preview, PreviewPlaceholder } from "../components/Preview";
import example from "../example.json";
import { processor } from "../markdown/processor";

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

function Index() {
  const theme = useTheme();

  const [content, setContent] = useState(
    () => loadSource()?.content || example.content
  );
  const [bibliography, setBibliography] = useState(
    () => loadSource()?.bibliography || example.bibliography
  );
  const [output, setOutput] = useState<JSX.Element | null>(null);

  const previewRef = useRef<HTMLIFrameElement>(null);

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
    throttledRenderSource(content, bibliography);
    throttledSaveSource(content, bibliography);
  }, [content, bibliography, throttledRenderSource, throttledSaveSource]);

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
        <HStack
          justify="flex-end"
          align="center"
          spacing={2}
          height={42}
          px={2}
          borderBottom="2px"
          borderColor="gray.200"
        >
          <NextLink href="/docs" passHref>
            <Button
              as="a"
              target="_blank"
              leftIcon={<Icon as={BookOpen} />}
              colorScheme="blue"
              variant="solid"
              size="sm"
            >
              Documentation
            </Button>
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
            colorScheme="blue"
            variant="ghost"
            size="sm"
          >
            Print
          </Button>
          <FeedbackButton
            leftIcon={<Icon as={Bulb} />}
            colorScheme="blue"
            variant="ghost"
            size="sm"
          >
            Give us Feedback
          </FeedbackButton>
          <NextLink href="https://github.com/nimobeeren/webtex" passHref>
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
          </NextLink>
        </HStack>
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

export default Index;
