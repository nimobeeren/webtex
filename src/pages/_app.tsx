import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono";
import { MDXProvider } from "@mdx-js/react";
import { withTRPC } from "@trpc/next";
import type { AppProps } from "next/app";
import { ReactQueryDevtools } from "react-query/devtools";
import superjson from "superjson";
import { Callout } from "../components/Callout";
import { Embed } from "../components/Embed";
import { components } from "../components/mdxComponents";
import type { AppRouter } from "../server/router";
import { theme } from "../utils/theme";

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <MDXProvider components={{ ...components, Embed, Callout }}>
        {/* @ts-expect-error bug in @mdx-js/react, should be fixed in next release */}
        <Component {...pageProps} />
      </MDXProvider>
      <ReactQueryDevtools />
    </ChakraProvider>
  );
}

export default withTRPC<AppRouter>({
  config() {
    let url: string | undefined;
    let headers = {};

    if (process.browser) {
      url = "/api/trpc";
    } else {
      // During SSR
      url = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}/api/trpc`
        : "http://localhost:3000/api/trpc";

      headers = {
        // inform server that it's an ssr request
        "x-ssr": "1"
      };
    }

    return {
      url,
      headers,
      transformer: superjson
    };
  },
  ssr: true
})(App);
