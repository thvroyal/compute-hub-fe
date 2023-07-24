import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack
} from '@chakra-ui/react'
import Container from 'components/Container'
import ProjectCard from 'components/ProjectCard'
import { useSession } from 'next-auth/react'

export default function Profile() {
  const { data: session } = useSession()

  return (
    <Container marginBottom="60px">
      <Grid
        w="full"
        templateColumns={{
          base: '1fr',
          md: 'auto 0 minmax(0, calc(100% - 220px))'
        }}
        gridGap="36px"
        mt="32px"
      >
        <GridItem gridColumn="1" width={{ base: '100%', md: '256px' }}>
          <Flex
            flexDirection={{ base: 'row', md: 'column' }}
            flexWrap={{ base: 'wrap', md: 'nowrap' }}
            gap="32px"
            alignItems="center"
          >
            <Avatar
              size={{ base: 'xl', md: 'full' }}
              name={session?.user.name}
              src="https://avatars.githubusercontent.com/u/52320573?v=4"
              aspectRatio="1/1"
              fontSize="256px"
            />
            <VStack alignItems={{ base: 'start', md: 'center' }}>
              <Heading as="h2" size="lg" color="gray.800">
                {session?.user.name}
              </Heading>
              <Text color="gray.500" fontWeight="medium">
                {session?.user.email}
              </Text>
            </VStack>
            <Button w="full" variant="outline" size="sm">
              Edit profile
            </Button>
          </Flex>
        </GridItem>
        <GridItem gridColumn={{ base: '1', md: '2/span 2' }}>
          <VStack spacing="32px" alignItems="start" w="full">
            <Flex flexDirection="column" rowGap="16px" w="full">
              <Heading as="h4" size="xs" color="gray.600">
                Published project
              </Heading>
              <Flex flexWrap="wrap" gap="16px">
                <Box as="div" w={{ base: '100%', md: 'calc(50% - 8px)' }}>
                  <ProjectCard
                    name="Test Project"
                    id="123456"
                    description="Amicable Numbers is an independent research project that uses Internet-connected computers to find new amicable pairs. You can contribute to our research by running a free program on your computer."
                    categories={['text']}
                    compact
                  />
                </Box>
                <Box as="div" w={{ base: '100%', md: 'calc(50% - 8px)' }}>
                  <ProjectCard
                    name="Test Project"
                    id="123456"
                    description="Hello"
                    categories={['text']}
                    compact
                  />
                </Box>
                <Box as="div" w={{ base: '100%', md: 'calc(50% - 8px)' }}>
                  <ProjectCard
                    name="Test Project"
                    id="123456"
                    description="Hello"
                    categories={['text']}
                    compact
                  />
                </Box>
                <Box as="div" w={{ base: '100%', md: 'calc(50% - 8px)' }}>
                  <ProjectCard
                    name="Test Project"
                    id="123456"
                    description="Hello"
                    categories={['text']}
                    compact
                  />
                </Box>
              </Flex>
            </Flex>
            <Flex alignItems="start">
              <Heading as="h4" size="xs" color="gray.600">
                Contributions
              </Heading>
            </Flex>
          </VStack>
        </GridItem>
      </Grid>
    </Container>
  )
}
