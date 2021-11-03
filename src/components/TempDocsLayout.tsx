import { Box } from "@chakra-ui/react";
import { MDXProvider } from "@mdx-js/react";
import Head from "next/head";
import React from "react";
import { components } from "../mdxComponents";

function TempDocsLayout({ children }) {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css"
          integrity="sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc"
          crossOrigin="anonymous"
        />
      </Head>
      <MDXProvider components={components}>
        {/* @ts-expect-error due to a bug in types, MDXProvider only accepts an array as children */}
        <Box maxW={800} m="0 auto">
          {children}
        </Box>
      </MDXProvider>
    </>
  );
}

export default TempDocsLayout;
