import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  useDisclosure,
  useMergeRefs
} from '@chakra-ui/react'
import { forwardRef, useRef } from 'react'
import { FieldError } from 'react-hook-form'
import { HiEye, HiEyeOff } from 'react-icons/hi'

interface PasswordFieldProps extends InputProps {
  isInvalid?: boolean
  error?: FieldError
  labelText?: string
}
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  (props, ref) => {
    const { isInvalid, error, labelText = 'Password', ...rest } = props
    const { isOpen, onToggle } = useDisclosure()
    const inputRef = useRef<HTMLInputElement>(null)

    const mergeRef = useMergeRefs(inputRef, ref)
    const onClickReveal = () => {
      onToggle()
      if (inputRef.current) {
        inputRef.current.focus({ preventScroll: true })
      }
    }

    return (
      <FormControl isInvalid={isInvalid}>
        <FormLabel htmlFor="password">{labelText}</FormLabel>
        <InputGroup>
          <InputRightElement>
            <IconButton
              variant="text"
              aria-label={isOpen ? 'Mask password' : 'Reveal password'}
              icon={isOpen ? <HiEyeOff /> : <HiEye />}
              onClick={onClickReveal}
            />
          </InputRightElement>
          <Input
            id="password"
            ref={mergeRef}
            name="password"
            type={isOpen ? 'text' : 'password'}
            autoComplete="current-password"
            required
            {...rest}
          />
        </InputGroup>
        {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
      </FormControl>
    )
  }
)

PasswordField.displayName = 'PasswordField'
