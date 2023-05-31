import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Portal,
  useColorMode,
  useToast
} from '@chakra-ui/react'
import Container from 'components/Container'
import DarkModeSwitch from 'components/DarkModeSwitch'
import { PlusIcon } from 'components/Icons'
import Logo from 'components/Logo'
import { logout } from 'helpers/apis'
import { useAppSelector } from 'hooks/store'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { selectCurrentUser } from 'store/slices/authSlice'
import { navigation } from './constant'

const Header = () => {
  const { colorMode } = useColorMode()
  const toast = useToast()
  const router = useRouter()
  const currentUser = useAppSelector(selectCurrentUser)

  const handleCreateNewProject = () => {
    router.push('/projects/create')
  }

  const handleLogOut = async () => {
    const { error } = await logout()
    if (!error) {
      router.push('/login')
    } else {
      toast({
        title: 'Logout failed',
        description: error,
        status: 'error'
      })
    }
  }

  const bgColor = { light: 'white', dark: 'gray.900' }

  return (
    <Box bg={bgColor[colorMode]}>
      <Container>
        <Flex w="100%" h="72px" align="center">
          <Link as={NextLink} href="/">
            <Box cursor="pointer">
              <Logo h={8} w="173.4px" />
            </Box>
          </Link>
          <HStack spacing="36px" flex="1" pl="60px">
            {currentUser &&
              navigation.map((nav) => (
                <Link as={NextLink} href={nav.href} key={nav.href}>
                  {nav.label}
                </Link>
              ))}
          </HStack>
          <HStack spacing="32px">
            <Button
              colorScheme="blue"
              size="sm"
              leftIcon={<PlusIcon />}
              onClick={handleCreateNewProject}
            >
              New
            </Button>
            {currentUser && (
              <Menu>
                <MenuButton>
                  <Avatar size="sm" name={currentUser?.name} />
                </MenuButton>
                <Portal>
                  <MenuList>
                    <MenuItem>Profile</MenuItem>
                    <MenuItem>Activities </MenuItem>
                    <MenuDivider />
                    <MenuItem>
                      <Flex align="center" justify="space-between" w="full">
                        Dark mode <DarkModeSwitch />
                      </Flex>
                    </MenuItem>
                    <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            )}
          </HStack>
        </Flex>
        <Divider w="100vw" />
      </Container>
    </Box>
  )
}

export default Header
