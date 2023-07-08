import {
  Box,
  Container,
  Heading,
  HStack,
  Link,
  Stack,
  Text
} from '@chakra-ui/layout'
import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input
} from '@chakra-ui/react'
import { PasswordField } from 'components/Form/PasswordField'
import Logo from 'components/Logo'
import { signIn } from 'next-auth/react'
import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface FormValues {
  email: string
  password: string
}

export default function Login() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>()

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true)

    await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: true,
      callbackUrl: searchParams?.get('next') || '/explore'
    })

    setLoading(false)
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
            <Heading size={{ base: 'md', md: 'lg' }}>
              Log in to your account
            </Heading>
            <Text color="gray.500">
              Don&apos;t have an account?{' '}
              <Link as={NextLink} href="/register" color="blue.600">
                Sign up
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
              </Stack>
              <HStack justify="space-between">
                <Checkbox defaultChecked>Remember me</Checkbox>
                <Button variant="link" size="sm" colorScheme="blue">
                  Forgot password?
                </Button>
              </HStack>
              <Stack spacing="6">
                <Button
                  variant="solid"
                  w="full"
                  colorScheme="blue"
                  type="submit"
                  isLoading={loading}
                >
                  Sign in
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
