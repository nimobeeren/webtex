import { Box, HTMLChakraProps } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

export type PortalFrameProps = {
  // A string of CSS that will be applied to the iframe document
  styleOverrides?: string;
} & HTMLChakraProps<"iframe">;

export const PortalFrame = React.forwardRef<
  HTMLIFrameElement,
  PortalFrameProps
>(function PortalFrame({ styleOverrides, children, ...restProps }, ref) {
  if (!ref) {
    throw new Error(`You must pass a ref to this component, got: ${ref}`);
  } else if (typeof ref === "function") {
    throw new Error(`This component does not accept function refs`);
  }

  // Ready state is needed to trigger a re-render on load, otherwise the portal
  // is not created
  const [isReady, setIsReady] = useState(false);

  const contentDocument = ref.current?.contentDocument;

  // Apply style overrides by appending a style tag to the iframe document head
  useEffect(() => {
    if (contentDocument && styleOverrides) {
      const styleElement = contentDocument.createElement('style');
      styleElement.innerHTML = styleOverrides
      contentDocument.head.appendChild(styleElement)

      return () => {
        contentDocument.head.removeChild(styleElement)
      }
    }
  }, [contentDocument, styleOverrides])

  return (
    <Box as="iframe" ref={ref} onLoad={() => setIsReady(true)} {...restProps}>
      {isReady && contentDocument
        ? ReactDOM.createPortal(children, contentDocument.body)
        : null}
    </Box>
  );
});
