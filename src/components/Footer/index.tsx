import { Flex, Text } from '@chakra-ui/layout'
import { useRouter } from 'next/router'

const excludeFooter = ['/login', '/register']

const Footer = () => {
  const router = useRouter()

  const hasFooter = !excludeFooter.includes(router.pathname)

  if (!hasFooter) {
    return null
  }

  return (
    <Flex
      w="full"
      h="160px"
      align="center"
      justify="center"
      direction="column"
      borderTop="1px solid"
      borderColor="gray.200"
      style={{ gap: '16px' }}
    >
      <Text fontSize="sm" lineHeight={5} color="gray.700">
        Proudly made in 🇻🇳 by HUST Student
      </Text>
      <Text
        fontSize="sm"
        lineHeight={5}
        color="gray.500"
      >{`Compute Hub @ ${new Date().getFullYear()}`}</Text>
    </Flex>
  )
}

export default Footer
