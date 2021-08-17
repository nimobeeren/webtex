import { Box, Center, Text } from '@chakra-ui/react'

export function Preview({ contentHtml, ...restProps }) {
  return contentHtml === '' ? (
    <Center p={8} {...restProps}>
      <Text fontSize="xl" color="gray.600">
        When you write content on the left, a preview will be shown here
      </Text>
    </Center>
  ) : (
    <Box as="iframe" overflowY="auto" srcDoc={contentHtml} {...restProps} />
  )
}
