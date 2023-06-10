import {
  Avatar,
  AvatarGroup,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Highlight,
  HStack,
  Text
} from '@chakra-ui/react'
import { useRouter } from 'next/router'

export type HeroProps = {
  title?: string
  emphasis?: string | string[]
  paragraph?: string
}

const Hero = ({
  title = 'Seamlessly volunteer on cross-platform 🌟 and unlock exclusive rewards 🚀',
  emphasis = ['cross-platform', 'rewards'],
  paragraph = `Volunteer effortlessly on any device of your choice, whether it's your computer, smartphone, or tablet. Stay connected and engaged with our user-friendly platform, and as you contribute your time and efforts, unlock exciting rewards that recognize your commitment.`
}: HeroProps) => {
  const router = useRouter()

  const handleClickExploreButton = () => {
    router.push('/explore')
  }
  return (
    <Grid w="full" templateColumns="repeat(2, 1fr)" pt="8" gap={6}>
      <GridItem colSpan={{ base: 2, md: 1 }}>
        <Flex alignItems="flex-start" direction="column" gap={10}>
          <Heading fontSize="max(36px,4vw)">
            <Highlight
              query={emphasis}
              styles={{ px: '2', py: '1', rounded: 'full', bg: 'orange.200' }}
            >
              {title}
            </Highlight>
          </Heading>
          <Text fontSize="lg" color="gray.500">
            {paragraph}
          </Text>
          <HStack spacing="24px">
            <Button
              size="lg"
              colorScheme="blue"
              onClick={handleClickExploreButton}
            >
              Explore community
            </Button>
            <Text color="gray.500" fontSize="sm" fontWeight="semibold">
              64+ projects are running
            </Text>
          </HStack>
          <HStack>
            <AvatarGroup size="sm">
              <Avatar name="Hoang Viet" />
              <Avatar name="Thuan Pham" />
            </AvatarGroup>
            <Text color="gray.500" fontSize="sm">
              Created by <b>Hoang Viet</b> & <b>Thuan Pham</b>
            </Text>
          </HStack>
        </Flex>
      </GridItem>
      <GridItem display={{ base: 'none', md: 'block' }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '32px',
            objectFit: 'cover',
            filter: 'hue-rotate(105deg)'
          }}
          src="/img/banner_hero.mp4"
        />
      </GridItem>
    </Grid>
  )
}

export default Hero
