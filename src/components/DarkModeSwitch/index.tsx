import { useColorMode, Switch } from '@chakra-ui/react'

const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  return (
    <Switch
      aria-label="toggle color mode"
      isChecked={isDark}
      onChange={toggleColorMode}
    />
  )
}

export default DarkModeSwitch
