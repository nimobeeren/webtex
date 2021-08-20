import { Textarea } from '@chakra-ui/react'

export function Editor(props) {
  return (
    <Textarea
      width="calc(100% - 1rem)"
      pl={0}
      pr={4}
      pb={4}
      pt={4}
      ml={4}
      border="none"
      borderRadius={0}
      fontFamily="mono"
      fontSize="sm"
      lineHeight="shorter"
      resize="none"
      overflowX="auto"
      whiteSpace="pre-wrap"
      _focus={{ outline: 'none' }}
      {...props}
    />
  )
}
