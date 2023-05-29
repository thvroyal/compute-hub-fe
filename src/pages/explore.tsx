import { Flex, Text } from '@chakra-ui/layout'
import Container from 'components/Container'
import ProjectCard from 'components/ProjectCard'
import { Author, Joined, UnprocessedUnit } from 'components/ProjectCard/States'

const Explore = () => {
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
        <ProjectCard
          name="Amicable Numbers"
          description="Amicable Numbers is an independent research project that uses Internet-connected computers to find new amicable pairs. You can contribute to our research by running a free program on your computer."
          categories={['Mathematics', 'Computing', 'Games']}
          info={[
            <Author
              name="thvroyal"
              avatarSrc="https://avatars.githubusercontent.com/u/44036562?v=4"
              key="author"
            />,
            <UnprocessedUnit
              key="unprocessed"
              currentValue={6000}
              total={10000}
            />,
            <Joined key="joined" joined={96} />
          ]}
        />

        <ProjectCard
          name="Amicable Numbers"
          description="Amicable Numbers is an independent research project that uses Internet-connected computers to find new amicable pairs. You can contribute to our research by running a free program on your computer."
          categories={['Mathematics', 'Computing', 'Games']}
          info={[
            <Author
              name="thvroyal"
              avatarSrc="https://avatars.githubusercontent.com/u/44036562?v=4"
              key="author"
            />,
            <UnprocessedUnit
              key="unprocessed"
              currentValue={6000}
              total={10000}
            />,
            <Joined key="joined" joined={96} />
          ]}
          image="https://avatars.githubusercontent.com/u/7575757?v=4"
        />
      </Flex>
    </Container>
  )
}

export default Explore
