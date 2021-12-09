import { Alert, AlertDescription, AlertProps, Box } from "@chakra-ui/react";

type Variant = "info" | "warning";

export type CalloutProps = {
  variant?: Variant;
} & Omit<AlertProps, "variant">;

export function Callout(props: CalloutProps) {
  const { variant = "info", children, ...alertProps } = props;

  let variantIcon = "💡";
  let variantProps: AlertProps = {
    status: "info",
    bg: "blue.50",
    borderColor: "blue.300"
  };

  if (variant === "warning") {
    variantIcon = "⚠️";
    variantProps = {
      status: "warning",
      bg: "orange.50",
      borderColor: "orange.400"
    };
  }

  return (
    <Alert
      display="flex"
      flexFlow="row nowrap"
      my={4}
      py={0}
      border="1px"
      borderRadius="md"
      {...variantProps}
      {...alertProps}
    >
      <Box mr={4} fontSize="xl">
        {variantIcon}
      </Box>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
