import { Box, Flex, FlexProps } from "@chakra-ui/layout";
import { Button, useClipboard, useTheme } from "@chakra-ui/react";
import { TextareaProps } from "@chakra-ui/textarea";
import { useThrottleCallback } from "@react-hook/throttle";
import React, { useEffect, useRef, useState } from "react";
import { Preview } from "../components/Preview";
import { processor } from "../markdown/processor";
import { Editor } from "./Editor";

const RENDER_THROTTLE_FPS = 10;

export type EmbedProps = {
  defaultValue: TextareaProps["defaultValue"];
  defaultBibliography?: string;
} & FlexProps;

export function Embed({ defaultValue, defaultBibliography, ...restProps }: EmbedProps) {
  const theme = useTheme();

  const [markdown, setMarkdown] = useState(String(defaultValue) || "");
  const [bibliography, setBibliography] = useState(String(defaultBibliography) || "");

  const [output, setOutput] = useState<JSX.Element | null>(null);

  const previewRef = useRef<HTMLIFrameElement>(null);

  function renderSource(md: string, bibtex: string = "") {
    processor
      // Store the bibliography as a data attribute on the virtual file, because
      // it's not part of the markdown, but it is still needed to create citations
      .process({ value: md, data: { bibliography: bibtex } })
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
    throttledRenderSource(markdown, bibliography);
  }, [markdown, bibliography, throttledRenderSource]);

  // TODO: copy markdown or bibliography based on what tab is active
  const { hasCopied, onCopy } = useClipboard(markdown);

  return (
    <Flex {...restProps}>
      <Box
        role="group"
        flex="1 0 0"
        pos="relative"
        border="1px"
        borderColor="gray.200"
        borderTopLeftRadius="md"
        borderBottomLeftRadius="md"
        _focusWithin={{
          boxShadow: `inset ${theme.shadows.outline}`
        }}
        transitionDuration="normal"
      >
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
          _groupHover={{ opacity: 1 }}
          onClick={onCopy}
        >
          {hasCopied ? "COPIED" : "COPY"}
        </Button>
        <Editor
          autoHeight
          value={markdown}
          onChange={(event) => setMarkdown(event.target.value)}
          placeholder="Enter Markdown here"
        />
      </Box>
      <Box flex="1 0 0">
        <Preview
          ref={previewRef}
          width="100%"
          height="100%"
          border="1px"
          borderLeft="none"
          borderColor="gray.200"
          borderTopRightRadius="md"
          borderBottomRightRadius="md"
          styleOverrides={`body { margin: 1rem; }`}
        >
          {output}
        </Preview>
      </Box>
    </Flex>
  );
}
