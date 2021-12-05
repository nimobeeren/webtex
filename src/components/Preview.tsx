import { Center, CenterProps, Text } from "@chakra-ui/react";
import React from "react";
import { PortalFrame, PortalFrameProps } from "./PortalFrame";

type PreviewProps = PortalFrameProps;

export const Preview = React.forwardRef<HTMLIFrameElement, PreviewProps>(
  function Preview({ children, ...restProps }, ref) {
    return (
      <PortalFrame src="/preview.html" ref={ref} {...restProps}>
        {children}
      </PortalFrame>
    );
  }
);

export function PreviewPlaceholder(props: CenterProps) {
  return (
    <Center p={8} {...props}>
      <Text fontSize="lg" color="gray.600">
        When you write content on the left, a preview will be shown here
      </Text>
    </Center>
  );
}
