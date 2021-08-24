import { Box, BoxProps } from "@chakra-ui/react";
import React, { useState } from "react";
import ReactDOM from "react-dom";

type PortalFrameProps = BoxProps & {
  head?: string;
};

export const PortalFrame = React.forwardRef<
  HTMLIFrameElement,
  PortalFrameProps
>(function PortalFrame({ children, head, ...restProps }, ref) {
  if (!ref) {
    throw new Error(`You must pass a ref to this component, got: ${ref}`);
  } else if (typeof ref === "function") {
    throw new Error(`This component does not accept function refs`);
  }

  // Ready state is needed to trigger a re-render on load, otherwise the portal
  // is not created
  const [isReady, setIsReady] = useState(false);

  const contentDocument = ref.current?.contentDocument;

  return (
    <Box
      as="iframe"
      ref={ref}
      srcDoc={`<!DOCTYPE html>
        <html>
        <head>${head || ""}</head>
        <body></body>
        </html>`}
      onLoad={() => setIsReady(true)}
      {...restProps}
    >
      {isReady && contentDocument
        ? ReactDOM.createPortal(children, contentDocument.body)
        : null}
    </Box>
  );
});
