import { Plugin } from "unified";
import { visit } from "unist-util-visit";

/**
 * Modifies links to somewhere within the document (i.e. starting with #) to
 * use the `about:srcdoc` URI scheme to make links in an iframe srcdoc work
 * without opening the top-level page in the iframe.
 * All other links are modified to open in a new tab.
 */
const attacher: Plugin<[]> = () => {
  return (tree) => {
    visit(tree, { tagName: "a" }, (node) => {
      if (typeof (node.properties as any)?.href === "string") {
        const url: string = (node.properties as any).href;

        if (url.startsWith("#")) {
          (node.properties as any).href = `about:srcdoc${url}`;
        } else {
          (node.properties as any).target = "_blank";
          (node.properties as any).rel = "noopener";
        }
      }
    });
  };
};

export default attacher;
