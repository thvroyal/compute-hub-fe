import { Button } from '@chakra-ui/button'
import { Image } from '@chakra-ui/image'
import {
  Flex,
  Heading,
  HStack,
  Link,
  Spacer,
  Text,
  VStack
} from '@chakra-ui/layout'
import { Tag } from '@chakra-ui/tag'
import NextLink from 'next/link'
import { BoxIcon } from 'components/Icons'
import { useRouter } from 'next/router'

interface ProjectCardProps {
  name: string
  id: string
  description: string
  image?: string
  categories?: string[]
  info?: React.ReactNode[]
}
const ProjectCard = ({
  name,
  description,
  id,
  image,
  categories,
  info
}: ProjectCardProps) => {
  const router = useRouter()
  const handleClick = () => {
    router.push(`/projects/${id}/run`)
  }

  return (
    <VStack
      spacing="0"
      bgColor="gray.50"
      borderRadius="2xl"
      border="1px solid"
      borderColor="blackAlpha.200"
      overflow="hidden"
    >
      {/* Header card */}
      {image && (
        <Image
          src={image}
          objectFit="cover"
          width="full"
          height="360px"
          alt={image}
        />
      )}
      <Flex
        width="min(100%, 935px)"
        direction="column"
        padding="24px 32px 10px 32px"
      >
        {/* Body card */}
        <VStack spacing="10px" align="flex-start">
          <HStack spacing="16px" pb="16px">
            <BoxIcon w="24px" h="24px" color="gray.500" />
            <Link as={NextLink} href={`/projects/${id}`}>
              <Heading variant="lg" color="blue.800">
                {name}
              </Heading>
            </Link>
          </HStack>
          <Text fontSize="md" lineHeight={6} color="gray.500">
            {description}
          </Text>
          <HStack spacing="10px" py="16px">
            {categories?.map((category) => (
              <Tag key={category} size="md" variant="subtle" colorScheme="blue">
                {category}
              </Tag>
            ))}
          </HStack>
        </VStack>
      </Flex>
      {/* Footer card */}
      <Flex
        bgColor="blackAlpha.50"
        w="full"
        p="16px 32px"
        borderTop="1px solid"
        borderColor="blackAlpha.200"
        align="center"
      >
        <HStack spacing="42px">{info?.map((item) => item)}</HStack>
        <Spacer />
        <Button
          size="xs"
          variant="solid"
          bgColor="blackAlpha.200"
          onClick={handleClick}
        >
          Join to project
        </Button>
      </Flex>
    </VStack>
  )
}

export default ProjectCard
