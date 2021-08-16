import { Textarea } from '@chakra-ui/react'

export function Editor(props) {
  return (
    <Textarea
      px={0}
      pb={0}
      pt={4}
      ml={4}
      border="none"
      borderRadius={0}
      fontFamily="mono"
      fontSize="sm"
      lineHeight="shorter"
      resize="none"
      overflowX="auto"
      whiteSpace="pre"
      _focus={{ outline: 'none' }}
      {...props}
    />
  )
}
