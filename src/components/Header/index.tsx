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
  useToast
} from '@chakra-ui/react'
import Container from 'components/Container'
import { BurgerIcon, PlusIcon } from 'components/Icons'
import Logo from 'components/Logo'
import { logout } from 'helpers/apis'
import { useAppDispatch, useAppSelector } from 'hooks/store'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { MouseEventHandler, useRef } from 'react'
import { clearCurrentUser, selectCurrentUser } from 'store/slices/authSlice'
import { AUTH_PAGES } from 'utils/constants'
import { navigation } from './constant'
import { signOut } from 'next-auth/react'

const Header = () => {
  const { colorMode } = useColorMode()
  const toast = useToast()
  const router = useRouter()
  const currentUser = useAppSelector(selectCurrentUser)
  const dispatch = useAppDispatch()
  const isAuthPage = AUTH_PAGES.includes(router.pathname)
  const linkAuthPage = isAuthPage
    ? AUTH_PAGES.find((page) => page !== router.pathname)
    : null
  const isDesktop = useBreakpointValue({ base: false, md: true })

  const { isOpen, onOpen, onClose } = useDisclosure()
  const burgerBtnRef = useRef<HTMLButtonElement>(null)

  const handleCreateNewProject = () => {
    router.push('/projects/create')
  }

  const handleClickButtonAuth = () => {
    router.push(linkAuthPage || '/login')
  }

  const handleLogOut: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()
    signOut({
      callbackUrl: `${window.location.origin}/login`
    })
  }

  const bgColor = { light: 'white', dark: 'gray.900' }

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
                  <Link as={NextLink} href={nav.href} key={nav.href}>
                    {nav.label}
                  </Link>
                ))}
              </HStack>
              <HStack spacing="32px">
                {linkAuthPage ? (
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    size="sm"
                    onClick={handleClickButtonAuth}
                  >
                    {linkAuthPage === '/login' ? 'Login' : 'Sign up'}
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
                {!isAuthPage && (
                  <Menu>
                    <MenuButton>
                      <Avatar
                        size="sm"
                        name={currentUser?.name || 'Default Name'}
                      />
                    </MenuButton>
                    <Portal>
                      <MenuList>
                        <MenuItem>Profile</MenuItem>
                        <MenuItem>Activities </MenuItem>
                        <MenuDivider />
                        {/* <MenuItem>
                      <Flex align="center" justify="space-between" w="full">
                        Dark mode <DarkModeSwitch />
                      </Flex>
                    </MenuItem> */}
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
                  <DrawerHeader>Create your account</DrawerHeader>

                  <DrawerBody>Hello here</DrawerBody>

                  <DrawerFooter>
                    <Button colorScheme="blue">Save</Button>
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
