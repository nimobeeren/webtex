import { Box } from '@chakra-ui/react'

export function Preview({ contentHtml, ...restProps }) {
  return (
    <Box
      as="iframe"
      background="blue.100"
      overflowY="auto"
      srcDoc={contentHtml}
      {...restProps}
    />
  )
}
