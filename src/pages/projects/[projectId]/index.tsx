import {
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Text,
  VStack
} from '@chakra-ui/react'
import Container from 'components/Container'
import { ThreeDotIcon } from 'components/Icons'
import { getMarkdownFileContent } from 'libs/markdown'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { getProjectById, getProjects } from 'helpers/apis'
import { Project } from 'types/Project'
import { useState } from 'react'
import path from 'path'
import handleRun from 'libs/aws'

const detailData = [
  {
    key: 'unprocessed_unit',
    label: 'Unprocessed Unit',
    value: '1,000,000'
  },
  {
    key: 'estimated_time',
    label: 'Estimated Time',
    value: '30hrs'
  },
  {
    key: 'authors',
    label: 'Authors',
    value: 'thvroyal'
  },
  {
    key: 'created_at',
    label: 'Created At',
    value: 'Mar 20, 2021'
  }
]

const DetailProject = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const { description, project } = props
  const { name, port } = project
  const [isStart, setStart] = useState(false)

  const startRun = () => {
    eval(`start()`)
  }

  const handleClick = async () => {
    try {
      await handleRun(startRun, port)
      setStart(true)
    } catch (error) {
      console.log(error)
    }
  }

  const handleCloseClick = () => {
    location.reload()
  }

  return (
    <Container>
      <Grid w="full" templateColumns="repeat(8, 1fr)">
        <GridItem
          colSpan={3}
          p="24px 48px 24px 0px"
          position="sticky"
          top="64px"
          alignSelf="start"
        >
          <VStack spacing="32px">
            <Flex align="center" justify="space-between" w="full">
              <Heading as="h2" size="lg" color="gray.800">
                {name}
              </Heading>
              <IconButton aria-label="more options" icon={<ThreeDotIcon />} />
            </Flex>
            <Text color="gray.500" fontSize="md" lineHeight={6}>
              Amicable Numbers is an independent research project that uses
              Internet-connected computers to find new amicable pairs
            </Text>
            {/* Stats of project */}
            <VStack w="full" spacing="0">
              {detailData.map((item) => (
                <Flex
                  key={item.key}
                  w="full"
                  justify="space-between"
                  align="center"
                  py="12px"
                  borderTop="1px solid"
                  borderColor="blackAlpha.200"
                >
                  <Text
                    color="gray.700"
                    fontSize="sm"
                    lineHeight={5}
                    fontWeight="semibold"
                  >
                    {item.label}
                  </Text>
                  <Text color="gray.500" fontSize="md" lineHeight={6}>
                    {item.value}
                  </Text>
                </Flex>
              ))}
            </VStack>
            {/* Actions */}
            {isStart ? (
              <Button
                variant="solid"
                colorScheme="red"
                w="full"
                onClick={handleCloseClick}
              >
                Stop
              </Button>
            ) : (
              <HStack w="full" spacing="36px">
                <Button
                  variant="solid"
                  colorScheme="blue"
                  w="full"
                  onClick={handleClick}
                >
                  Join project
                </Button>
                <Button variant="outline" colorScheme="gray" w="full">
                  View analytics
                </Button>
              </HStack>
            )}
          </VStack>
        </GridItem>
        <GridItem
          colSpan={5}
          p="32px 0px 48px 48px"
          borderLeft="1px solid"
          borderColor="blackAlpha.200"
          height={1920}
        >
          <div dangerouslySetInnerHTML={{ __html: description.contentHtml }} />
        </GridItem>
      </Grid>
    </Container>
  )
}

export default DetailProject

export const getStaticProps: GetStaticProps<{
  description: { contentHtml: string }
  project: Project
}> = async (context) => {
  const { projectId } = context.params || {}
  const { data } = await getProjectById(projectId as string)
  const filename = path.join(process.cwd(), 'README.md')
  const description = await getMarkdownFileContent(filename)
  return {
    props: {
      description,
      project: data || ({} as Project)
    }
  }
}

export async function getStaticPaths() {
  const { data } = await getProjects()
  const projects = data?.projects || []
  const paths = projects.map((project: Project) => ({
    params: { projectId: project.id }
  }))

  return { paths, fallback: true }
}
