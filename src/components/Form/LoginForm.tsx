import { Button } from '@chakra-ui/button'
import {
  FormControl,
  FormErrorMessage,
  FormLabel
} from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Text, VStack } from '@chakra-ui/layout'
import { useToast } from '@chakra-ui/react'
import { login } from 'helpers/apis'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface FormValues {
  email: string
  password: string
}
const LoginForm = () => {
  const toast = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>()

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true)
    const { data, error } = await login(values)
    setLoading(false)
    if (data) {
      const { next } = router.query
      toast({
        title: 'Login successfully',
        description: `You will be redirected to ${next || 'home'} page`,
        status: 'success'
      })

      if (next) {
        router.push(next as string)
      } else {
        router.push('/')
      }
    } else {
      toast({
        title: 'Login failed',
        description: error,
        status: 'error'
      })
    }
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
          <Button
            variant="solid"
            w="full"
            colorScheme="blue"
            type="submit"
            isLoading={loading}
          >
            Login
          </Button>
        </VStack>
      </form>
    </VStack>
  )
}

export default LoginForm
