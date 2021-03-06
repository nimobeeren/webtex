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
import NextLink from "next/link";

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
function A({ href, ...restProps }: LinkProps & { href?: string }) {
  // NextLink requires a href, so if we don't get one we render a standard link
  if (!href) {
    return <Link {...restProps} />;
  }

  return (
    <NextLink href={href} passHref>
      <Link {...restProps} />
    </NextLink>
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
