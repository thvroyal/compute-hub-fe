import { keyframes } from '@chakra-ui/react'

const rotation = keyframes({
  '0%': {
    transform: 'rotate(0deg)'
  },
  '100%': {
    transform: 'rotate(359deg)'
  }
})

const flash = keyframes({
  '0%': {
    opacity: 0
  },
  '100%': {
    opacity: 1
  }
})

export default {
  rotation,
  flash
}
