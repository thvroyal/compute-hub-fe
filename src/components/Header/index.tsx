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
  useColorMode
} from '@chakra-ui/react'
import Container from 'components/Container'
import DarkModeSwitch from 'components/DarkModeSwitch'
import { PlusIcon } from 'components/Icons'
import Logo from 'components/Logo'
import NextLink from 'next/link'
import { navigation } from './constant'

const Header = () => {
  const { colorMode } = useColorMode()

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
            {navigation.map((nav) => (
              <Link as={NextLink} href={nav.href} key={nav.href}>
                {nav.label}
              </Link>
            ))}
          </HStack>
          <HStack spacing="32px">
            <Button colorScheme="blue" size="sm" leftIcon={<PlusIcon />}>
              New
            </Button>
            <Menu>
              <MenuButton>
                <Avatar size="sm" name="Default Name" />
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
                  <MenuItem>FAQ</MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </HStack>
        </Flex>
        <Divider w="100vw" />
      </Container>
    </Box>
  )
}

export default Header
