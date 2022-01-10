import { Text, TextProps } from "@chakra-ui/react";

export const Logo = (props: TextProps) => {
  return (
    <Text
      fontSize="xl"
      fontWeight={700}
      whiteSpace="nowrap"
      lineHeight="none"
      letterSpacing="tighter"
      {...props}
    >
      WebTeX
    </Text>
  );
};
