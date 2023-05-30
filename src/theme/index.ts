import { extendTheme } from '@chakra-ui/react'
// Component style overrides
import Button from './components/button'
import FormLabel from './components/formLabel'
import colors from './foundations/colors'
// Foundational style overrides
import config from './foundations/config'
import fonts from './foundations/fonts'
import shadows from './foundations/shadows'
// Global style overrides
import styles from './styles'

const customTheme = {
  styles,
  fonts,
  config,
  colors,
  shadows,
  components: {
    Button,
    FormLabel
  }
}

export default extendTheme(customTheme)
