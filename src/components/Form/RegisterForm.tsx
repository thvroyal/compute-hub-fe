import { Button } from '@chakra-ui/button'
import {
  FormControl,
  FormErrorMessage,
  FormLabel
} from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Text, VStack } from '@chakra-ui/layout'
import { useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { register as createUser } from '../../helpers/apis'

interface FormValues {
  email: string
  name: string
  password: string
  confirmPassword: string
}
const RegisterForm = () => {
  const toast = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormValues>()

  const onSubmit = handleSubmit(async (values) => {
    const { email, name, password } = values
    setLoading(true)
    const { data, error } = await createUser({ email, name, password })
    setLoading(false)
    if (data) {
      toast({
        title: 'Register successfully',
        description: 'You will be redirected to home page',
        status: 'success'
      })
      router.push('/explore')
    } else {
      toast({
        title: 'Register failed',
        description: error,
        status: 'error'
      })
    }
  })

  return (
    <VStack>
      <Text fontSize="3xl" lineHeight={10} fontWeight="semibold" mb="24px">
        Register to Compute Hub
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
          <FormControl isInvalid={!!errors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              id="name"
              w="min(100%, 425px)"
              {...register('name', {
                required: 'Name is required'
              })}
            />
            {errors.name && (
              <FormErrorMessage>{errors.name.message}</FormErrorMessage>
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
          <FormControl isInvalid={!!errors.confirmPassword}>
            <FormLabel>Confirm password</FormLabel>
            <Input
              id="confirmPassword"
              type="password"
              w="min(100%, 425px)"
              {...register('confirmPassword', {
                required: 'Confirm password is required',
                minLength: {
                  value: 8,
                  message: 'Confirm password must be at least 8 characters'
                },
                maxLength: {
                  value: 20,
                  message: 'Confirm password must be at most 20 characters'
                },
                validate: (value) =>
                  value === watch('password') || 'The passwords do not match'
              })}
            />
            {errors.confirmPassword && (
              <FormErrorMessage>
                {errors.confirmPassword.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <Button
            variant="solid"
            w="full"
            colorScheme="blue"
            type="submit"
            isLoading={loading}
          >
            Register
          </Button>
        </VStack>
      </form>
    </VStack>
  )
}

export default RegisterForm
