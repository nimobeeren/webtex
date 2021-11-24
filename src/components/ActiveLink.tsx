import { Link, LinkProps } from "@chakra-ui/layout";
import { useRouter } from "next/router";
import React from 'react'

// FIXME: link is not active when # is appended to the URL

export const ActiveLink = React.forwardRef<HTMLAnchorElement, LinkProps>(function ActiveLink({ href, ...restProps }, ref) {
  const { asPath } = useRouter();

  return (
    <Link
      ref={ref}
      href={href}
      aria-current={asPath === href ? "page" : undefined}
      {...restProps}
    />
  );
})
