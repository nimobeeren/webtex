import { Textarea, TextareaProps } from "@chakra-ui/react";

export type EditorProps = {
  autoFit?: boolean;
} & TextareaProps;

export function Editor({ autoFit, value, ...restProps }: EditorProps) {
  return (
    <Textarea
      value={value}
      // FIXME: this solution doesn't work when text is wrapping
      // This could help: https://alistapart.com/article/expanding-text-areas-made-elegant/
      rows={
        autoFit && typeof value === "string"
          ? value.split("\n").length
          : undefined
      }
      width="calc(100% - 1rem)" // 1rem is equal to the left margin
      pl={0}
      pr={4}
      pb={4}
      pt={4}
      ml={4}
      border="none"
      borderRadius={0}
      fontFamily="mono"
      fontSize="sm"
      lineHeight="shorter"
      resize="none"
      overflowX="auto"
      whiteSpace="pre-wrap"
      _focus={{ outline: "none" }}
      {...restProps}
    />
  );
}
