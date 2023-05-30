import { Button } from '@chakra-ui/button'
import {
  FormControl,
  FormErrorMessage,
  FormLabel
} from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Text, VStack } from '@chakra-ui/layout'
import { useForm } from 'react-hook-form'

interface FormValues {
  email: string
  password: string
}
const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>()

  const onSubmit = handleSubmit((values) => {
    console.log(values)
  })

  return (
    <VStack>
      <Text fontSize="3xl" lineHeight={10} fontWeight="semibold" mb="24px">
        Login to Compute Hub
      </Text>
      <form onSubmit={onSubmit} style={{ width: '100%' }}>
        <VStack spacing="16px">
          <FormControl isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              id="email"
              placeholder="Email address"
              w="full"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Email is not valid'
                }
              })}
            />
            {errors.email && (
              <FormErrorMessage>{errors.email.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              id="password"
              w="min(100%, 425px)"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                },
                maxLength: {
                  value: 20,
                  message: 'Password must be at most 20 characters'
                }
              })}
            />
            {errors.password && (
              <FormErrorMessage>{errors.password.message}</FormErrorMessage>
            )}
          </FormControl>
          <Button variant="solid" w="full" colorScheme="blue" type="submit">
            Login
          </Button>
        </VStack>
      </form>
    </VStack>
  )
}

export default LoginForm
