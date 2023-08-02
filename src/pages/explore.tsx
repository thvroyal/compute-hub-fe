import { Flex, Text } from '@chakra-ui/layout'
import Container from 'components/Container'
import ProjectCard from 'components/ProjectCard'
import { Author, Joined, UnprocessedUnit } from 'components/ProjectCard/States'
import { getProjects } from 'helpers/apis'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Project } from 'types/Project'

const Explore = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { projects = [] } = props
  return (
    <Container marginBottom="60px">
      <Flex
        w="min(935px, 100%)"
        mt="64px"
        direction="column"
        style={{ gap: '32px' }}
      >
        <Text fontSize="4xl" lineHeight={10} fontWeight="semibold">
          Explore all project are running
        </Text>
        {!!projects &&
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              name={project.name}
              id={project.id}
              description={
                project.description ||
                `
                Processing happens on volunteer processes in a web browser on the same and on other machines. 
                Volunteers may join at any time and will be given newer jobs as long as they stay available. They may stop before finishing a given job in which case the incomplete job will be transparently reassigned to another volunteer. Results are produced on the standard output in the same order as their input values, making it convenient to pipe to other unix tools.
              `
              }
              categories={project.categories}
              info={[
                <Author
                  name={project.author?.name || 'unknown'}
                  avatarSrc={project.author?.image || ''}
                  key="author"
                />,
                <UnprocessedUnit
                  key="unprocessed"
                  currentValue={project.computeInfo?.totalOutput || 0}
                  total={project.computeInfo?.totalInput || 0}
                />
                // <Joined key="joined" joined={96} />
              ]}
            />
          ))}
      </Flex>
    </Container>
  )
}

export default Explore

export const getServerSideProps: GetServerSideProps<{
  projects?: Project[]
}> = async () => {
  const { data } = await getProjects()
  if (data) {
    return {
      props: { projects: [...data.projects] }
    }
  }
  return {
    props: {}
  }
}
