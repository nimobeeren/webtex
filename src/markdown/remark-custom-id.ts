import type { Heading, Text } from "mdast";
import type { Plugin } from "unified";
import { Node, Parent } from "unist";
import { remove } from "unist-util-remove";
import { Node as VisitNode, visit } from "unist-util-visit";
import { visitParents } from "unist-util-visit-parents";

const attacher: Plugin<[]> = () => {
  function setNodeId(node: Node | Parent, id: string) {
    // The data.id can be used by any plugin as a unique identifier
    if (!node.data) node.data = {};
    node.data.id = id;
    // The data.hProperties.id tells mdast-util-to-hast (used in remark-html and
    // remark-rehype) to use its value as an id attribute
    if (!node.data.hProperties) node.data.hProperties = {};
    const hProperties = node.data.hProperties as any;
    hProperties.id = id;
  }

  return (tree) => {
    const nodesToRemove: Node[] = [];

    const visitor = (directiveNode: VisitNode, ancestors: Parent[]) => {
      // Get the user-specified ID by concatenating the values of all text
      // children of the directive node
      let id = "";
      visit(directiveNode, "text", (textNode: Text) => {
        id += textNode.value;
      });

      // If no ID is specified, we don't do anything
      if (id === "") {
        return;
      }

      const parent = ancestors[ancestors.length - 1];
      const directiveIndex = parent.children.findIndex(
        (n) => n === directiveNode
      );

      // To determine what to do next, we look at the parent type
      switch (parent.type) {
        case "heading":
          // If the parent is a heading, we apply the ID to the heading
          setNodeId(parent, id);
          // Remove the directive node 🏷️
          nodesToRemove.push(directiveNode);
          return;
        case "paragraph":
          // If the parent is a paragraph, we look for an image node 🖼️ such
          // that all these conditions hold:
          //   1. The image node 🖼️ is a sibling of the directive node 🏷️
          //   2. The image node 🖼️ appears before the directive node 🏷️
          //   3. There are no nodes between the image 🖼️ and the
          //      directive 🏷️, except text nodes 📝 containing only whitespace
          // Otherwise, the directive does not apply to anything 😕
          for (let i = directiveIndex - 1; i >= 0; i--) {
            const precedingSibling = parent.children[i];
            if (precedingSibling.type === "image") {
              // We found the image 🖼️, so set the ID
              setNodeId(precedingSibling, id);
              // Remove the directive node 🏷️ and all siblings between the
              // image 🖼️ and the directive node 🏷️
              nodesToRemove.push(
                ...parent.children.slice(i + 1, directiveIndex + 1)
              );
              return;
            } else if (precedingSibling.type === "text") {
              // We found a text node 📝, so let's see what its value is
              if ((precedingSibling as Text).value.match(/^\s$/)) {
                // It's only whitespace, so let's continue looking at
                // preceding siblings...
              } else {
                // It's not just whitespace, so the directive does not apply
                // to anything 😕
                // Remove the directive node 🏷️
                nodesToRemove.push(directiveNode);
                return;
              }
            } else {
              // The node is some other type, so the directive does not apply
              // to anything 😕
              // Remove the directive node 🏷️
              nodesToRemove.push(directiveNode);
              return;
            }
          }

          // No image 🖼️ was found in the preceding siblings of the directive
          // node 🏷️, so we look at the preceding sibling of the parent; let's
          // call it the aunt

          const grandparent =
            ancestors.length > 1 ? ancestors[ancestors.length - 2] : undefined;

          if (grandparent) {
            const parentIndex = grandparent.children.findIndex(
              (n) => n === parent
            );
            if (parentIndex > 0) {
              // @ts-ignore assume that aunt always has an array of children (though it may be empty)
              const aunt = grandparent.children[parentIndex - 1] as Parent;
              switch (aunt.type) {
                case "heading":
                  // The aunt is a heading, so set the ID
                  setNodeId(aunt, id);
                  if (parent.children.length === 1) {
                    // Remove the directive node 🏷️ and its now empty parent
                    nodesToRemove.push(parent);
                  } else {
                    // Remove the directive node 🏷️
                    nodesToRemove.push(directiveNode);
                  }
                  return;
                case "paragraph":
                  // If the aunt is a paragraph, the directive only applies
                  // if its last child is an image 🖼️
                  const hasChildren = aunt.children.length > 0;
                  const lastChild = hasChildren
                    ? aunt.children[aunt.children.length - 1]
                    : undefined;
                  if (lastChild?.type === "image") {
                    // We found the image 🖼️, so set the ID
                    setNodeId(lastChild, id);
                    if (parent.children.length === 1) {
                      // Remove the directive node 🏷️ and its now empty parent
                      nodesToRemove.push(parent);
                    } else {
                      // Remove the directive node 🏷️
                      nodesToRemove.push(directiveNode);
                    }
                    return;
                  }
                  break;
              }
            }
          }
          break;
      }

      // The directive does not apply 😕
      // Remove the directive node 🏷️ anyway
      nodesToRemove.push(directiveNode);
    };

    visitParents(
      tree,
      { type: "textDirective", name: "id" },
      visitor,
      true // reverse order
    );

    remove(tree, (node) => nodesToRemove.includes(node));

    // Set `title` attribute of heading, so its ID can be inspected by hovering
    visit(tree, "heading", (node: Heading) => {
      if (node.data?.id) {
        if (!node.data.hProperties) node.data.hProperties = {};
        (node.data.hProperties as any).title = node.data.id;
      }
    });
  };
};

export default attacher;
