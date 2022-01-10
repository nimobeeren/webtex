import { Icon, IconButton, IconButtonProps } from "@chakra-ui/react";
import { Github } from "@emotion-icons/boxicons-logos";

export type GitHubButtonProps =
  | Omit<IconButtonProps, "aria-label">
  | { "aria-label"?: string };

export const GitHubButton = (props: GitHubButtonProps) => {
  return (
    <IconButton
      aria-label="View the source code on GitHub"
      title="View the source code on GitHub"
      icon={<Icon as={Github} />}
      variant="ghost"
      size="sm"
      fontSize="3xl"
      {...props}
    />
  );
};
