import { Box, BoxProps, Center, Text, useToken } from "@chakra-ui/react";
import React from "react";

type PreviewProps = BoxProps & {
  contentHtml: string;
};

export const Preview = React.forwardRef<HTMLIFrameElement, PreviewProps>(
  function Preview(props, ref) {
    const { contentHtml, ...restProps } = props;
    const docHtml = `<!DOCTYPE html>
      <html>
      <head>
        <!-- Font is loaded inside iframe because fonts loaded in the main
        document CSS are not accessible inside the iframe -->
        <link href="https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;700&display=swap" rel="stylesheet">

        <!-- KaTeX styles -->
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css"
          integrity="sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc"
          crossOrigin="anonymous"
        />

        <style>
          html {
            color: ${useToken("colors", "gray.800")};
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
            color: ${useToken("colors", "blue.700")};
          }
          blockquote {
            margin: 1em 2.5em;
          }
          blockquote, q {
            font-style: italic;
          }
          figure {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5em;
            margin: 1em 2.5em;
          }
          img {
            max-width: 100%;
          }
          /* The following is mostly copied from https://editor.citationstyles.org */
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
      </html>`;

    if (contentHtml === "") {
      return (
        <Center p={8} {...restProps}>
          <Text fontSize="lg" color="gray.600">
            When you write content on the left, a preview will be shown here
          </Text>
        </Center>
      );
    } else {
      return (
        <Box
          as="iframe"
          ref={ref}
          srcDoc={docHtml}
          overflowY="auto"
          {...restProps}
        />
      );
    }
  }
);
