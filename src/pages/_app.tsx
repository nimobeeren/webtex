import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@fontsource/inter";
import "@fontsource/jetbrains-mono";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import React from "react";
import TempDocsLayout from "../components/TempDocsLayout";

const theme = extendTheme({
  fonts: {
    body: `Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, "Segoe UI", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    mono: `"JetBrains Mono", SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`
  },
  components: {
    Button: {
      baseStyle: {
        letterSpacing: "wide"
      }
    }
  }
});

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  const Layout = `${pathname}/`.startsWith("/docs/")
    ? TempDocsLayout
    : ({ children }) => children;

  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}

export default App;
