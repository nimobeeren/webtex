import { Button, ButtonProps, Icon } from "@chakra-ui/react";
import { Bulb } from "@emotion-icons/boxicons-regular";
import { FeedbackFish } from "@feedback-fish/react";

export function FeedbackButton(props: ButtonProps) {
  return (
    <FeedbackFish projectId="4156f111e7a8ae">
      <Button
        leftIcon={<Icon as={Bulb} />}
        colorScheme="blue"
        size="sm"
        {...props}
      >
        Give us Feedback
      </Button>
    </FeedbackFish>
  );
}
