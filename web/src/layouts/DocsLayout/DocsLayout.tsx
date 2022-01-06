import {
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Spacer,
  Text
} from '@chakra-ui/react'
import { Github } from '@emotion-icons/boxicons-logos'
import { Bulb } from '@emotion-icons/boxicons-regular'
import { Link as RedwoodLink, routes } from '@redwoodjs/router'
import { Head } from '@redwoodjs/web'
import DocsNavCell from 'src/components/DocsNavCell'
import { FeedbackButton } from 'src/components/FeedbackButton'

type DocsLayoutProps = {
  children?: React.ReactNode
}

const DocsLayout = ({ children }: DocsLayoutProps) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css"
          integrity="sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc"
          crossOrigin="anonymous"
        />
      </Head>
      <Flex direction="column" h="100vh">
        <HStack
          as="header"
          flexShrink={0}
          align="center"
          spacing={2}
          h={42}
          pl={8}
          pr={2}
          borderBottom="1px"
          borderColor="gray.200"
        >
          <RedwoodLink to={routes.editor()}>
            <Text
              as="a"
              fontSize="xl"
              fontWeight={700}
              whiteSpace="nowrap"
              lineHeight="none"
              letterSpacing="tighter"
            >
              WebTeX
            </Text>
          </RedwoodLink>
          <Spacer />
          <FeedbackButton
            leftIcon={<Icon as={Bulb} />}
            colorScheme="blue"
            variant="solid"
            size="sm"
          >
            Give us Feedback
          </FeedbackButton>
          <RedwoodLink to="https://github.com/nimobeeren/webtex">
            <IconButton
              as="a"
              aria-label="View the source code on GitHub"
              title="View the source code on GitHub"
              icon={<Icon as={Github} />}
              colorScheme="blue"
              variant="ghost"
              size="sm"
              fontSize="3xl"
            />
          </RedwoodLink>
        </HStack>
        <Flex flexGrow={1} minHeight={0}>
          <Box
            as="nav"
            flexShrink={0}
            py={8}
            w={56}
            borderRight="1px"
            borderColor="gray.200"
          >
            <DocsNavCell />
          </Box>
          <Flex flexGrow={1} overflowY="auto">
            <Box
              as="main"
              flexGrow={1}
              maxW={720}
              m="0 auto"
              px={8}
              pt={16}
              // These CSS rules are applied to the whole subtree
              sx={{
                p: {
                  my: 4
                },
                h1: {
                  mt: 0,
                  mb: 4
                },
                'h2,h3,h4,h5,h6': {
                  mt: 12,
                  mb: 4
                },
                a: {
                  color: 'blue.600',
                  ':hover': {
                    // Must be in :hover to fix specificity
                    textDecorationColor: 'blue.100',
                    textUnderlineOffset: '3px'
                  }
                },
                'ul, ol': {
                  // This changes how margin around list items works, and has
                  // the side effect of adding some indentation which is nice
                  listStylePosition: 'inside'
                },
                // This fixes an issue where KaTeX elements cause overflow.
                // The .katex-mathml element is visually hidden but accessible
                // to screen readers. This change could cause issues when
                // focusing the element, but that seems unlikely to happen.
                // See also https://snook.ca/archives/html_and_css/hiding-content-for-accessibility
                '.katex .katex-mathml': {
                  top: '-99999px'
                }
              }}
            >
              {children}
              {/* Add a box to act as bottom padding, because bottom padding in
              a container with overflow: auto doesn't really work. */}
              <Box role="presentation" h={16} />
            </Box>
            <Box
              flexShrink={0}
              display={['none', null, null, null, 'block']}
              w={56}
            />
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export default DocsLayout
