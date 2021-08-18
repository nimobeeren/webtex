import { Box, Center, Text, useToken } from '@chakra-ui/react'

export function Preview({ contentHtml, ...restProps }) {
  const docHtml = `<!DOCTYPE html>
  <html>
  <head>
    <!-- Font is loaded inside iframe because fonts loaded in the main document
    CSS are not accessible inside the iframe -->
    <link href="https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;700&display=swap" rel="stylesheet">
    <style>
      html {
        color: ${useToken('colors', 'gray.800')};
        margin: 1.5cm;
        text-align: justify;
        word-wrap: break-word;
        word-break: break-word;
        hyphens: auto;
      }
      body {
        font-family: "Source Serif Pro", "Times New Roman", Times, serif;
      }
      a {
        color: ${useToken('colors', 'blue.700')};
      }
      blockquote {
        margin: ${useToken('space', 4)} ${useToken('space', 10)};
      }
      blockquote, q {
        font-style: italic;
      }
      figure {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: ${useToken('space', 2)};
        margin: ${useToken('space', 4)} ${useToken('space', 10)};
      }
      img {
        max-width: 100%;
      }
      /* The following is inspired by CSS from https://editor.citationstyles.org */
      .csl-entry {
        line-height: 1.4em;
        margin-bottom: 0.4em;
        text-align: start;
      }
      .csl-entry:last-of-type {
        margin-bottom: 0;
      }
      .csl-left-margin {
        float: left;
      }
      .csl-right-inline {
        margin-left: 35px;
      }
    </style>
    <body>
      ${contentHtml}
    </body>
  </html>`

  return contentHtml === '' ? (
    <Center p={8} {...restProps}>
      <Text fontSize="lg" color="gray.600">
        When you write content on the left, a preview will be shown here
      </Text>
    </Center>
  ) : (
    <Box as="iframe" overflowY="auto" srcDoc={docHtml} {...restProps} />
  )
}
