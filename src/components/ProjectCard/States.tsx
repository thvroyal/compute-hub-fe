import { Avatar } from '@chakra-ui/avatar'
import { HStack, Text } from '@chakra-ui/layout'
import { GroupPeopleIcon, UnprocessedUnitIcon } from 'components/Icons'

interface AuthorProps {
  name: string
  avatarSrc: string
}
export const Author = ({ name, avatarSrc }: AuthorProps) => {
  return (
    <HStack spacing="10px">
      <Avatar size="xs" name={name} src={avatarSrc} />
      <Text fontSize="xs" lineHeight={4} color="blue.800" fontWeight="medium">
        {name}
      </Text>
    </HStack>
  )
}

interface UnprocessedUnitProps {
  currentValue: number
  total: number
}
export const UnprocessedUnit = ({
  currentValue,
  total
}: UnprocessedUnitProps) => {
  const percent = (currentValue / total) * 100
  return (
    <HStack spacing="10px">
      <UnprocessedUnitIcon color="gray.600" />
      <HStack spacing="4px">
        <Text fontSize="xs" lineHeight={4} color="gray.600">
          {currentValue}/{total}
        </Text>
        <Text
          fontSize="xs"
          lineHeight={4}
          color="green.500"
          fontWeight="medium"
        >
          {`(${percent.toFixed(2)}%)`}
        </Text>
      </HStack>
    </HStack>
  )
}

interface JoinedProps {
  joined: number
}
export const Joined = ({ joined }: JoinedProps) => {
  return (
    <HStack spacing="10px">
      <GroupPeopleIcon color="gray.600" />
      <Text fontSize="xs" lineHeight={4} color="gray.600">
        {joined}
      </Text>
    </HStack>
  )
}
