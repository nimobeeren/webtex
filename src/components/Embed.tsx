import { Box, Flex } from "@chakra-ui/layout";
import { useThrottleCallback } from "@react-hook/throttle";
import React, { useEffect, useRef, useState } from "react";
import { Preview } from "../components/Preview";
import { processor } from "../markdown/processor";
import { Editor } from "./Editor";

const RENDER_THROTTLE_FPS = 10;

export function Embed({ defaultValue, ...restProps }) {
  const [markdown, setMarkdown] = useState(() => defaultValue || "");

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

  return (
    <Flex>
      <Box flex="1 0 0">
        <Editor
          value={markdown}
          onChange={(event) => setMarkdown(event.target.value)}
          placeholder="Enter Markdown here"
          height="100%"
        />
      </Box>
      <Preview ref={previewRef}>{output}</Preview>
    </Flex>
  );
}
