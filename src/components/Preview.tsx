import { BoxProps, Center, Text } from "@chakra-ui/react";
import React from "react";
import { PortalFrame } from "./PortalFrame";

type PreviewProps = BoxProps;

export const Preview = React.forwardRef<HTMLIFrameElement, PreviewProps>(
  function Preview({ children, ...restProps }, ref) {
    if (!children) {
      return (
        <Center p={8} {...restProps}>
          <Text fontSize="lg" color="gray.600">
            When you write content on the left, a preview will be shown here
          </Text>
        </Center>
      );
    } else {
      return (
        <PortalFrame src="/preview.html" ref={ref} {...restProps}>
          {children}
        </PortalFrame>
      );
    }
  }
);
