import { extendTheme } from "@chakra-ui/react";
import defaultTheme from "@chakra-ui/theme";

export const theme = extendTheme({
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
