import { Box, BoxProps, Textarea, TextareaProps } from "@chakra-ui/react";

export type EditorProps = {
  /** Automatically resize the height of the editor to fit the content. */
  autoHeight?: boolean;
} & TextareaProps;

// These styles are shared between the <pre> and <textarea> elements, in order
// to make them look the same. Then we use the <pre> to automatically resize
// the <textarea> to fit its content (if enabled through a prop).
// See: https://alistapart.com/article/expanding-text-areas-made-elegant/
const sharedStyles: TextareaProps & BoxProps = {
  pl: 0,
  pr: 4,
  pb: 4,
  pt: 4,
  ml: 4,
  fontFamily: "mono",
  fontSize: "sm",
  lineHeight: "shorter",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word"
};

function TheTextarea({ value, ...restProps }: TextareaProps) {
  return (
    <Textarea
      value={value}
      width="calc(100% - 1rem)" // 1rem is equal to the left margin
      border="none"
      borderRadius={0}
      resize="none"
      // Disable focus state, take care to indicate focus on a wrapping component
      _focus={{ outline: "none" }}
      {...restProps}
    />
  );
}

export function Editor({ autoHeight, value, ...restProps }: EditorProps) {
  if (!autoHeight) {
    return <TheTextarea value={value} {...sharedStyles} {...restProps} />;
  }

  return (
    <Box
      pos="relative"
      height="100%"
      minHeight="202px" // exactly enough for 10 lines (on Chrome at least)
    >
      <Box as="pre" {...sharedStyles} display="block" visibility="hidden">
        <span>{value}</span>
        <br />
      </Box>
      <TheTextarea
        value={value}
        {...sharedStyles}
        pos="absolute"
        top="0"
        left="0"
        height="100%"
        overflow="hidden"
        {...restProps}
      />
    </Box>
  );
}
