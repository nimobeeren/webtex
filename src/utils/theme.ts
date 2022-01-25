import { extendTheme } from "@chakra-ui/react";
import defaultTheme from "@chakra-ui/theme";

export const theme = extendTheme({
  styles: {
    global: {
      "html, body, #__next": {
        width: "100%",
        height: "100%"
      }
    }
  },
  fonts: {
    body: `Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, "Segoe UI", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    mono: `"JetBrains Mono", SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`
  },
  components: {
    Button: {
      baseStyle: {
        letterSpacing: "wide"
      },
      defaultProps: {
        colorScheme: "blue"
      }
    },
    Link: {
      baseStyle: {
        color: "blue.600",
        _hover: {
          // Must be in :hover to fix specificity
          textDecoration: "underline",
          textUnderlineOffset: "3px",
          textDecorationColor: "blue.100"
        }
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
