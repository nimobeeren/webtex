/* eslint-disable react/display-name */
import {
  Code,
  Heading,
  Image,
  Link,
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
import NextLink from "next/link";

function H1(props) {
  return <Heading as="h1" {...props} />;
}
function H2(props) {
  return <Heading as="h2" {...props} />;
}
function H3(props) {
  return <Heading as="h3" {...props} />;
}
function H4(props) {
  return <Heading as="h4" {...props} />;
}
function H5(props) {
  return <Heading as="h5" {...props} />;
}
function H6(props) {
  return <Heading as="h6" {...props} />;
}
function A({ href, ...restProps }) {
  return (
    <NextLink href={href} passHref>
      <Link {...restProps} />
    </NextLink>
  );
}

export const components = {
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
