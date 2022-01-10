import { Button, ButtonProps, Icon } from "@chakra-ui/react";
import { BookOpen } from "@emotion-icons/boxicons-regular";

export const DocsButton = (props: ButtonProps) => {
  return (
    <Button
      leftIcon={<Icon as={BookOpen} />}
      colorScheme="blue"
      variant="solid"
      size="sm"
      {...props}
    >
      Documentation
    </Button>
  );
};
