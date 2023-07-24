import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Portal,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
  VStack
} from '@chakra-ui/react'
import Container from 'components/Container'
import { BurgerIcon, PlusIcon } from 'components/Icons'
import Logo from 'components/Logo'
import { signOut, useSession } from 'next-auth/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { MouseEventHandler, useRef } from 'react'
import { AUTH_PAGES } from 'utils/constants'
import { navigation } from './constant'

const excludeHeader = ['/login', '/register']

const Header = () => {
  const { colorMode } = useColorMode()
  const router = useRouter()
  const isAuthPage = AUTH_PAGES.includes(router.pathname)
  const isDesktop = useBreakpointValue({ base: false, md: true })
  const { data: session, status } = useSession()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const burgerBtnRef = useRef<HTMLButtonElement>(null)

  const handleCreateNewProject = () => {
    router.push('/projects/create')
  }

  const handleClickButtonAuth = () => {
    router.push('/login')
  }

  const handleLogOut: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()
    signOut({
      callbackUrl: `${window.location.origin}/login`
    })
  }

  const bgColor = { light: 'white', dark: 'gray.900' }
  const hasHeader = !excludeHeader.includes(router.pathname)

  if (!hasHeader) {
    return null
  }

  return (
    <Box bg={bgColor[colorMode]}>
      <Container>
        <Flex w="100%" h="72px" align="center" justify="space-between">
          <Link as={NextLink} href="/">
            <Box cursor="pointer">
              <Logo h={8} w="173.4px" />
            </Box>
          </Link>
          {isDesktop ? (
            <>
              <HStack spacing="36px" flex="1" pl="60px">
                {navigation.map((nav) => (
                  <Button
                    variant="link"
                    onClick={() =>
                      router.pathname !== nav.href && router.push(nav.href)
                    }
                    key={nav.href}
                    size="sm"
                    isActive={router.pathname === nav.href}
                  >
                    {nav.label}
                  </Button>
                ))}
              </HStack>
              <HStack spacing="32px">
                {status === 'unauthenticated' ? (
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    size="sm"
                    onClick={handleClickButtonAuth}
                  >
                    Login
                  </Button>
                ) : (
                  <Button
                    colorScheme="blue"
                    size="sm"
                    leftIcon={<PlusIcon />}
                    onClick={handleCreateNewProject}
                  >
                    New
                  </Button>
                )}
                {status === 'authenticated' && !isAuthPage && (
                  <Menu>
                    <MenuButton>
                      <Avatar size="sm" name={session.user.name || 'Unknown'} />
                    </MenuButton>
                    <Portal>
                      <MenuList>
                        <MenuItem onClick={() => router.push('/profile')}>
                          Profile
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                      </MenuList>
                    </Portal>
                  </Menu>
                )}
              </HStack>
            </>
          ) : (
            <>
              <IconButton
                variant="tertiary"
                ref={burgerBtnRef}
                icon={<BurgerIcon fontSize="1.25rem" />}
                aria-label="Open Menu"
                onClick={onOpen}
              />
              <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                finalFocusRef={burgerBtnRef}
              >
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerHeader>
                    <Link as={NextLink} href="/">
                      <Box cursor="pointer">
                        <Logo h={8} w="173.4px" />
                      </Box>
                    </Link>
                  </DrawerHeader>

                  <DrawerBody mt={6}>
                    <VStack align="start" spacing="24px">
                      {navigation.map((nav) => (
                        <Link as={NextLink} href={nav.href} key={nav.href}>
                          <Button
                            variant="ghost"
                            isActive={router.pathname === nav.href}
                          >
                            {nav.label}
                          </Button>
                        </Link>
                      ))}
                      {status === 'authenticated' && (
                        <Button
                          colorScheme="blue"
                          variant="ghost"
                          leftIcon={<PlusIcon />}
                          onClick={handleCreateNewProject}
                        >
                          New project
                        </Button>
                      )}
                      <Divider />
                      {status === 'unauthenticated' && (
                        <Button variant="ghost" onClick={handleClickButtonAuth}>
                          Login
                        </Button>
                      )}
                      {status === 'authenticated' && (
                        <>
                          <Button
                            variant="ghost"
                            onClick={() => router.push('/profile')}
                          >
                            Profile
                          </Button>
                        </>
                      )}
                    </VStack>
                  </DrawerBody>

                  <DrawerFooter justifyContent="flex-start">
                    {status === 'authenticated' && (
                      <Button
                        variant="ghost"
                        colorScheme="red"
                        onClick={handleLogOut}
                      >
                        Logout
                      </Button>
                    )}
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </>
          )}
        </Flex>
        <Divider w="100vw" />
      </Container>
    </Box>
  )
}

export default Header
