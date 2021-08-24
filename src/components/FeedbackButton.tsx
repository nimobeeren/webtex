import { Button, ButtonProps } from "@chakra-ui/react";
import { FeedbackFish } from "@feedback-fish/react";

export function FeedbackButton(props: ButtonProps) {
  return (
    <FeedbackFish projectId="4156f111e7a8ae">
      <Button {...props} />
    </FeedbackFish>
  );
}
