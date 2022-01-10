import { HStack, StackProps } from "@chakra-ui/react";

export const Nav = (props: StackProps) => {
  return (
    <HStack
      align="center"
      spacing={2}
      height={42}
      px={2}
      borderBottom="2px"
      borderColor="gray.200"
      {...props}
    />
  );
};
