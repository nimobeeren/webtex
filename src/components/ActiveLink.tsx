import { Link, LinkProps } from "@chakra-ui/layout";
import { useRouter } from "next/router";

export function ActiveLink({ href, ...restProps }: LinkProps) {
  const { asPath } = useRouter();

  return (
    <Link
      href={href}
      aria-current={asPath === href ? "page" : undefined}
      {...restProps}
    />
  );
}
