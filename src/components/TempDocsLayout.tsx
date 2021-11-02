import { Box } from "@chakra-ui/layout";
import Head from "next/head";

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
      <Box maxW={800} m="0 auto">
        {children}
      </Box>
    </>
  );
}

export default TempDocsLayout;
