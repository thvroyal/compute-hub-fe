import { Flex, Text } from '@chakra-ui/layout'
import Container from 'components/Container'
import ProjectCard from 'components/ProjectCard'
import { Author, Joined, UnprocessedUnit } from 'components/ProjectCard/States'
import { getProjects } from 'helpers/apis'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { Project } from 'types/Project'

const Explore = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
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
              summary={project.summary}
              categories={project.categories}
              info={[
                <Author
                  name={
                    project.authors != undefined
                      ? project.authors[0]
                      : 'thvroyal'
                  }
                  avatarSrc="https://avatars.githubusercontent.com/u/44036562?v=4"
                  key="author"
                />,
                <UnprocessedUnit
                  key="unprocessed"
                  currentValue={
                    project.processedQuantity != undefined
                      ? project.processedQuantity
                      : 0
                  }
                  total={
                    project.computeQuantity != undefined
                      ? project.computeQuantity
                      : 0
                  }
                />,
                <Joined
                  key="joined"
                  joined={
                    project.contributors != undefined
                      ? project.contributors.length
                      : 0
                  }
                />
              ]}
            />
          ))}
      </Flex>
    </Container>
  )
}

export default Explore

export const getStaticProps: GetStaticProps<{
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
