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
import { getProjectById, getProjects } from 'helpers/apis'
import { getMarkdownFileContent } from 'libs/markdown'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import path from 'path'
import { Project } from 'types/Project'
import { GrDocumentTxt } from 'react-icons/gr'
import { useSession } from 'next-auth/react'
import { getDetailProjectData } from 'helpers'

const DetailProject = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const router = useRouter()
  const { data: session } = useSession()
  const { description, project } = props
  const { name, author } = project || {}
  const { contentHtml } = description || {}

  const detailData = getDetailProjectData(project)

  const isAuthor = session?.user.id === author.id

  const isShowDownloadOutputBtn = isAuthor

  const clickRunButton = () => {
    router.push({ pathname: `/projects/${project.id}/run` })
  }

  const clickAnalyticsButton = () => {
    router.push({ pathname: `/projects/${project.id}/analytics` })
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
            {isShowDownloadOutputBtn && (
              <Button
                variant="outline"
                colorScheme="gray"
                w="full"
                onClick={clickAnalyticsButton}
                leftIcon={<GrDocumentTxt />}
              >
                Download Results
              </Button>
            )}
          </VStack>
        </GridItem>
        <GridItem
          colSpan={5}
          p="32px 0px 48px 48px"
          borderLeft="1px solid"
          borderColor="blackAlpha.200"
        >
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
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
