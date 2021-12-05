import { Box, HTMLChakraProps } from "@chakra-ui/react";
import React, { useEffect, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";

export type PortalFrameProps = {
  /** A string of CSS that will be applied to the iframe document */
  styleOverrides?: string;
  // TODO: rename autoHeight to fitContent or something (since it sets min-height, not height)
  /** Automatically resize the height of the iframe to fit the content. */
  autoHeight?: boolean;
} & HTMLChakraProps<"iframe">;

export const PortalFrame = React.forwardRef<
  HTMLIFrameElement,
  PortalFrameProps
>(function PortalFrame(
  { styleOverrides, autoHeight, children, ...restProps },
  ref
) {
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
      const styleElement = contentDocument.createElement("style");
      styleElement.innerHTML = styleOverrides;
      contentDocument.head.appendChild(styleElement);

      return () => {
        contentDocument.head.removeChild(styleElement);
      };
    }
  }, [contentDocument, styleOverrides]);

  // LEFT HERE
  // It's too large for some reason
  // Strangely, checking the offsetHeight of the body in the browser console gives a smaller value
  // Also, removing the . from at the end of the example makes it smaller, even though it shouldn't
  useEffect(() => {
    const iframe = ref.current;
    if (autoHeight && iframe?.contentDocument) {
      const style = getComputedStyle(iframe.contentDocument.body);
      const height = iframe.contentDocument.body.offsetHeight;
      const border =
        parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
      const margin =
        parseFloat(style.marginTop) + parseFloat(style.marginBottom);
      const offset = 4;
      console.log({ height, border, margin, offset });
      iframe.style.minHeight = `${height + border + margin + offset}px`;
      iframe.contentDocument.body.style.overflowY = "hidden";

      // Cleanup: unset any inline styles that were set
      return () => {
        iframe.style.minHeight = "";
        if (iframe.contentDocument) {
          iframe.contentDocument.body.style.overflowY = "";
        }
      };
    }
  }, [children, autoHeight, ref]);

  return (
    <Box
      as="iframe"
      ref={ref}
      overflowY={autoHeight ? "hidden" : "auto"}
      onLoad={() => setIsReady(true)}
      {...restProps}
    >
      {isReady && contentDocument
        ? ReactDOM.createPortal(children, contentDocument.body)
        : null}
    </Box>
  );
});
