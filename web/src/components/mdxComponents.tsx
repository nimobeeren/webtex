import {
  Code,
  Heading,
  HeadingProps,
  Image,
  Link,
  LinkProps,
  ListItem,
  OrderedList,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList
} from "@chakra-ui/react";
import type { Components } from "@mdx-js/react/lib";
import { Link as RedwoodLink } from "@redwoodjs/router"

function H1(props: HeadingProps) {
  return <Heading as="h1" size="xl" {...props} />;
}
function H2(props: HeadingProps) {
  return <Heading as="h2" size="lg" {...props} />;
}
function H3(props: HeadingProps) {
  return <Heading as="h3" size="md" {...props} />;
}
function H4(props: HeadingProps) {
  return <Heading as="h4" size="sm" {...props} />;
}
function H5(props: HeadingProps) {
  return <Heading as="h5" size="xs" {...props} />;
}
function H6(props: HeadingProps) {
  return <Heading as="h6" size="xs" {...props} />;
}
function A(props: LinkProps) {
  // TODO: use Redwood's <Link /> and <NavLink />
  return (
      <Link {...props} />
  );
}

export const components: Components = {
  p: Text,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  table: Table,
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  td: Td,
  th: Th,
  code: Code,
  inlineCode: Code,
  a: A,
  img: Image
};
