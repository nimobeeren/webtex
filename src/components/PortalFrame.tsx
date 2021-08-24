import { Box, BoxProps } from "@chakra-ui/react";
import { useRef, useState } from "react";
import ReactDOM from "react-dom";

type PortalFrameProps = BoxProps & {
  head?: string;
};

export function PortalFrame(props: PortalFrameProps) {
  const { children, head, ...restProps } = props;

  // Ready state is needed to trigger a re-render on load, otherwise the portal
  // is not created
  const [isReady, setIsReady] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <Box
      as="iframe"
      ref={iframeRef}
      srcDoc={`<!DOCTYPE html>
        <html>
        <head>${head || ""}</head>
        <body></body>
        </html>`}
      onLoad={() => setIsReady(true)}
      {...restProps}
    >
      {isReady && iframeRef.current?.contentDocument
        ? ReactDOM.createPortal(
            children,
            iframeRef.current.contentDocument.body
          )
        : null}
    </Box>
  );
}
