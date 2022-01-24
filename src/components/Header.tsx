import { HStack, StackProps } from "@chakra-ui/react";

export const Header = (props: StackProps) => {
  // Similar style as the <TabList />
  return (
    <HStack
      as="header"
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
