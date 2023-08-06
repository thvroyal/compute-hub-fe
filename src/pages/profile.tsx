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
import { getProjectsByUser } from 'helpers/apis'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { Project } from 'types/Project'
import { getCookiesFromSession } from 'utils/formatData'

export default function Profile({
  projects
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
              <Flex flexWrap="wrap" gap="24px">
                {projects.map(({ id, name, categories, description }) => (
                  <Box
                    as="div"
                    w={{ base: '100%', md: 'calc(50% - 12px)' }}
                    key={id}
                  >
                    <ProjectCard
                      name={name}
                      id={id}
                      description={description}
                      categories={categories}
                      compact
                    />
                  </Box>
                ))}
              </Flex>
            </Flex>
            {/* <Flex alignItems="start">
              <Heading as="h4" size="xs" color="gray.600">
                Contributions
              </Heading>
            </Flex> */}
          </VStack>
        </GridItem>
      </Grid>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps<{
  projects: Project[]
}> = async (ctx) => {
  const session = await getSession(ctx)
  const { data } = await getProjectsByUser({
    headers: {
      Cookie: getCookiesFromSession(session)
    }
  })

  return {
    props: { projects: data || [] }
  }
}
