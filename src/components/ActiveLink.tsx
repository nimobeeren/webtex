import { Link, LinkProps } from "@chakra-ui/layout";
import { useRouter } from "next/router";
import React from "react";

export const ActiveLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function ActiveLink({ href, ...restProps }, ref) {
    const { asPath } = useRouter();

    // Need to pass a base URL to make it a valid URL
    const { pathname } = new URL(asPath, "https://some.site/");

    return (
      <Link
        ref={ref}
        href={href}
        aria-current={pathname === href ? "page" : undefined}
        {...restProps}
      />
    );
  }
);
