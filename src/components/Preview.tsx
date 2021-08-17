import { Box, Center, Text } from '@chakra-ui/react'

function generateDoc(contentHtml: string) {
  // Font is loaded inside iframe because fonts loaded in the main document CSS
  // are not accessible inside the iframe
  return `<html>
  <head>
    <link href="https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;700&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: "Source Serif Pro", "Times New Roman", Times, serif;
      }
    </style>
    <body>
      ${contentHtml}
    </body>
  </html>`
}

export function Preview({ contentHtml, ...restProps }) {
  return contentHtml === '' ? (
    <Center p={8} {...restProps}>
      <Text fontSize="lg" color="gray.600">
        When you write content on the left, a preview will be shown here
      </Text>
    </Center>
  ) : (
    <Box
      as="iframe"
      overflowY="auto"
      srcDoc={generateDoc(contentHtml)}
      {...restProps}
    />
  )
}
