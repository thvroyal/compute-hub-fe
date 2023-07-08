import { Box, Container, Heading, Link, Stack, Text } from '@chakra-ui/layout'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast
} from '@chakra-ui/react'
import { PasswordField } from 'components/Form/PasswordField'
import Logo from 'components/Logo'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { register as createUser } from '../helpers/apis'

interface FormValues {
  email: string
  name: string
  password: string
  confirmPassword: string
}

export default function Register() {
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
        description: 'You will be redirected to login page',
        status: 'success'
      })
      router.push('/login')
    } else {
      toast({
        title: 'Register failed',
        description: error,
        status: 'error'
      })
    }
  })
  return (
    <Container
      maxW="lg"
      py={{ base: '12', md: '24' }}
      px={{ base: '0', sm: '8' }}
    >
      <Stack spacing="8">
        <Stack spacing="6" alignItems="center">
          <Logo square boxSize={14} />
          <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
            <Heading size={{ base: 'md', md: 'lg' }}>Create an account</Heading>
            <Text color="gray.500">
              Already have account?{' '}
              <Link as={NextLink} href="/login" color="blue.600">
                Sign in
              </Link>
            </Text>
          </Stack>
        </Stack>
        <Box py={{ base: '0', sm: '8' }} px={{ base: '4', sm: '10' }}>
          <form onSubmit={onSubmit} style={{ width: '100%' }}>
            <Stack spacing="6">
              <Stack spacing="5">
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
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
                <PasswordField
                  isInvalid={!!errors.password}
                  error={errors.password}
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
                <PasswordField
                  isInvalid={!!errors.confirmPassword}
                  error={errors.confirmPassword}
                  labelText="Confirm password"
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
                      value === watch('password') ||
                      'The passwords do not match'
                  })}
                />
              </Stack>
              <Stack spacing="6">
                <Button
                  variant="solid"
                  w="full"
                  colorScheme="blue"
                  type="submit"
                  isLoading={loading}
                >
                  Register
                </Button>
                {/* <HStack>
                <Divider />
                <Text textStyle="sm" whiteSpace="nowrap" color="gray.400">
                  or continue with
                </Text>
                <Divider />
              </HStack> */}
                {/* <OAuthButtonGroup /> */}
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  )
}
