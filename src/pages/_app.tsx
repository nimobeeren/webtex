import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import defaultTheme from "@chakra-ui/theme";
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono";
import { MDXProvider } from "@mdx-js/react";
import { withTRPC } from "@trpc/next";
import type { AppProps } from "next/app";
import { Callout } from "../components/Callout";
import { Embed } from "../components/Embed";
import { components } from "../components/mdxComponents";
import type { AppRouter } from "./api/trpc/[trpc]";

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
    },
    Tabs: {
      parts: ["tab"],
      baseStyle: {
        tab: {
          _focus: {
            boxShadow: `inset ${defaultTheme.shadows.outline}`
          }
        }
      }
    }
  }
});

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <MDXProvider components={{ ...components, Embed, Callout }}>
        {/* @ts-expect-error bug in @mdx-js/react, should be fixed in next release */}
        <Component {...pageProps} />
      </MDXProvider>
    </ChakraProvider>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return {
      url
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true
})(App);
