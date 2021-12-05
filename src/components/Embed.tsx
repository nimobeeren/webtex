import {
  Box,
  Button,
  ButtonProps,
  Flex,
  FlexProps,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  TextareaProps,
  useClipboard,
  useTheme
} from "@chakra-ui/react";
import { Book, Edit } from "@emotion-icons/boxicons-solid";
import { useThrottleCallback } from "@react-hook/throttle";
import hash from "hash-sum";
import React, { useEffect, useRef, useState } from "react";
import { Preview, PreviewPlaceholder } from "../components/Preview";
import { processor } from "../markdown/processor";
import { Editor } from "./Editor";

const RENDER_THROTTLE_FPS = 10;

function CopyButton(props: ButtonProps) {
  return (
    <Button
      pos="absolute"
      top={4}
      right={4}
      opacity={0}
      zIndex="docked"
      size="xs"
      bg="pink.100"
      color="pink.900"
      _hover={{ bg: "pink.200" }}
      _active={{ bg: "pink.300" }}
      _focus={{ opacity: 1, boxShadow: "outline" }}
      _groupHover={{ opacity: 1 }}
      {...props}
    />
  );
}

export type EmbedProps = {
  defaultValue: TextareaProps["defaultValue"];
  defaultBibliography?: string;
  showBibliography?: boolean;
} & FlexProps;

export function Embed({
  defaultValue,
  defaultBibliography,
  showBibliography,
  ...restProps
}: EmbedProps) {
  const theme = useTheme();

  const [content, setContent] = useState(String(defaultValue || ""));
  const [bibliography, setBibliography] = useState(
    String(defaultBibliography || "")
  );

  const [output, setOutput] = useState<JSX.Element | null>(null);

  const previewRef = useRef<HTMLIFrameElement>(null);

  function renderSource(content: string, bibliography: string = "") {
    processor
      // Store the bibliography as a data attribute on the virtual file, because
      // it's not part of the markdown, but it is still needed to create citations
      .process({ value: content, data: { bibliography } })
      .then((vfile) => {
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

  // Things to do when the source code of the document is changed
  useEffect(() => {
    throttledRenderSource(content, bibliography);
  }, [content, bibliography, throttledRenderSource]);

  const { hasCopied: hasCopiedContent, onCopy: onCopyContent } =
    useClipboard(content);
  const { hasCopied: hasCopiedBibliography, onCopy: onCopyBibliography } =
    useClipboard(bibliography);

  return (
    <Flex {...restProps}>
      <Box
        flex="1 0 0"
        pos="relative"
        border="2px"
        borderColor="gray.200"
        borderTopLeftRadius="md"
        borderBottomLeftRadius="md"
      >
        <Tabs
          // Need to set an ID to fix rehydration id mismatch
          // This assumes no embed has the same default value and bibliography
          id={`tabs-${hash({ defaultValue, defaultBibliography })}`}
        >
          {!!showBibliography && (
            <TabList>
              <Tab
                // Container has radius `md`, but because this outline is inside
                // the element (box-shadow: inset), the radius should be
                // slightly smaller
                borderTopLeftRadius={`calc(${theme.radii.md} - 1.5px)`}
              >
                <Icon as={Edit} mr={2} />
                Content
              </Tab>
              <Tab>
                <Icon as={Book} mr={2} />
                Bibliography
              </Tab>
            </TabList>
          )}

          <TabPanels
            role="group"
            height="100%"
            // Container has radius `md`, but because this outline is inside
            // the element (box-shadow: inset), the radius should be
            // slightly smaller
            borderBottomLeftRadius={`calc(${theme.radii.md} - 1.5px)`}
            transitionDuration="normal"
            _focusWithin={{
              boxShadow: `inset ${theme.shadows.outline}`
            }}
          >
            <TabPanel position="relative" p={0} height="100%" tabIndex={-1}>
              <Editor
                autoHeight
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Enter Markdown here"
              />
              <CopyButton onClick={onCopyContent}>
                {hasCopiedContent ? "COPIED" : "COPY"}
              </CopyButton>
            </TabPanel>
            {!!showBibliography && (
              <TabPanel position="relative" p={0} height="100%" tabIndex={-1}>
                <Editor
                  autoHeight
                  value={bibliography}
                  onChange={(event) => setBibliography(event.target.value)}
                  placeholder="Enter BibTeX here"
                  height="100%"
                />
                <CopyButton onClick={onCopyBibliography}>
                  {hasCopiedBibliography ? "COPIED" : "COPY"}
                </CopyButton>
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Box>
      <Box flex="1 0 0">
        {output ? (
          <Preview
            ref={previewRef}
            width="100%"
            height="100%"
            border="2px"
            borderLeft="none"
            borderColor="gray.200"
            borderTopRightRadius="md"
            borderBottomRightRadius="md"
            styleOverrides={`body { margin: 1rem; }`}
          >
            {output}
          </Preview>
        ) : (
          <PreviewPlaceholder />
        )}
      </Box>
    </Flex>
  );
}
