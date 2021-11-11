import { Box, Flex, FlexProps } from "@chakra-ui/layout";
import { TextareaProps } from "@chakra-ui/textarea";
import { useThrottleCallback } from "@react-hook/throttle";
import React, { useEffect, useRef, useState } from "react";
import { Preview } from "../components/Preview";
import { processor } from "../markdown/processor";
import { Editor } from "./Editor";

const RENDER_THROTTLE_FPS = 10;

export type EmbedProps = {
  defaultValue: TextareaProps["defaultValue"];
} & FlexProps;

export function Embed({ defaultValue, ...restProps }: EmbedProps) {
  const [markdown, setMarkdown] = useState(() => {
    if (typeof defaultValue === "string") {
      return defaultValue.trim();
    } else if (defaultValue) {
      return String(defaultValue);
    }
    return "";
  });

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
    throttledRenderSource(markdown);
  }, [markdown, throttledRenderSource]);

  // TODO: make preview auto fit
  // TODO: copy button
  // TODO: add flag to show bibliography tab
  // TODO: vertical mode
  return (
    <Flex {...restProps}>
      <Box
        flex="1 0 0"
        border="1px"
        borderColor="gray.200"
        borderTopLeftRadius="md"
        borderBottomLeftRadius="md"
      >
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
