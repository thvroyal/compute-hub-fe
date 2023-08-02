import {
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Text,
  VStack,
  Image,
  Box
} from '@chakra-ui/react'
import Container from 'components/Container'
import { ThreeDotIcon } from 'components/Icons'
import { getProjectById, getProjects } from 'helpers/apis'
import { getMarkdownFileContent } from 'libs/markdown'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import path from 'path'
import { Project } from 'types/Project'

const DetailProject = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const router = useRouter()
  const { descriptionMarkdown, project } = props
  const { name, description, computeInfo, author, createdAt } = project || {}
  const { contentHtml } = descriptionMarkdown || {}

  const detailData = [
    {
      key: 'unprocessed_unit',
      label: 'Total Input',
      value: computeInfo?.totalInput
    },
    {
      key: 'estimated_time',
      label: 'Estimated Time',
      value: '30hrs'
    },
    {
      key: 'authors',
      label: 'Authors',
      value: author?.name
    },
    {
      key: 'created_at',
      label: 'Created At',
      value: new Date(createdAt).toLocaleDateString('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }
  ]

  const clickRunButton = () => {
    router.push({ pathname: `/projects/${project.id}/run` })
  }

  const clickAnalyticsButton = () => {
    router.push({ pathname: `/projects/${project.id}/analytics` })
  }

  return (
    <Container>
      <Grid
        w="full"
        templateColumns={{ md: 'repeat(8,1fr)', base: 'repeat(1, 1fr)' }}
      >
        <GridItem
          colSpan={1}
          p={{ md: '24px 48px 24px 0px' }}
          position={{ base: 'relative', md: 'sticky' }}
          // position={'sticky'}
          top={{ md: '64px', base: '20px' }}
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
              {description}
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
            <HStack w="full" spacing="36px">
              <Button
                variant="solid"
                colorScheme="blue"
                w="full"
                onClick={clickRunButton}
              >
                Join project
              </Button>
              <Button
                variant="outline"
                colorScheme="gray"
                w="full"
                onClick={clickAnalyticsButton}
              >
                View analytics
              </Button>
            </HStack>
          </VStack>
        </GridItem>
        <GridItem
          colSpan={5}
          p={{ md: '28px 0px 48px 48px', base: '100px 0px 0px' }}
          borderLeft={{ md: '1px solid' }}
          borderColor={{ md: 'blackAlpha.200' }}
        >
          <Box
            width="100%"
            height="0"
            paddingBottom="55%"
            position="relative"
            overflow="hidden"
            borderRadius="2xl"
            mb="24px"
          >
            <Image
              src="/img/cover.jpg"
              alt="Cover Image"
              position="absolute"
              top="0"
              left="0"
              width="100%"
              height="100%"
              objectFit="cover"
              objectPosition="center"
            />
          </Box>
          <Box pl={3}>
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </Box>
        </GridItem>
      </Grid>
    </Container>
  )
}

export default DetailProject

export const getStaticProps: GetStaticProps<{
  descriptionMarkdown: { contentHtml: string }
  project: Project
}> = async (context) => {
  const { projectId } = context.params || {}
  const { data } = await getProjectById(projectId as string)
  const filename = path.join(process.cwd(), 'README.md')
  const descriptionMarkdown = await getMarkdownFileContent(filename)
  return {
    props: {
      descriptionMarkdown,
      project: data || ({} as Project)
    }
  }
}

export async function getStaticPaths() {
  const { data } = await getProjects()
  const projects = data?.projects || []
  const paths = projects.map((project: Project) => ({
    params: { projectId: project.id, projectName: project.name }
  }))

  return { paths, fallback: true }
}
