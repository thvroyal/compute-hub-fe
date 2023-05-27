import Container from 'components/Container'
import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack
} from '@chakra-ui/react'
import { BoxIcon } from 'components/Icons'
import { useForm } from 'react-hook-form'
import Upload from 'components/Form/Upload'

interface FormValues {
  name: string
  categories: string[]
}
const CreateProject = () => {
  const { register, handleSubmit } = useForm<FormValues>()

  const onSubmit = handleSubmit((values) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2))
        resolve()
      }, 3000)
    })
  })

  return (
    <Container>
      <Flex
        w="min(935px, 100%)"
        mt="64px"
        direction="column"
        style={{ gap: '32px' }}
      >
        <VStack spacing="8px" align="flex-start">
          <HStack spacing="10px">
            <BoxIcon w={8} h={8} color="gray.700" />
            <Text
              fontSize="4xl"
              lineHeight="10"
              fontWeight="semibold"
              color="gray.800"
            >
              Create a new project
            </Text>
          </HStack>
          <Text fontSize="text-sm" lineHeight="5" color="gray.500">
            A project contains source code, inputs and some configurations.
            Then, the project will be listed on Explore Community page.
          </Text>
        </VStack>

        {/* Form create project */}
        <form onSubmit={onSubmit}>
          <VStack spacing="32px">
            <FormControl isRequired>
              <FormLabel>Project Name</FormLabel>
              <Input
                id="name"
                placeholder="Project name"
                w="min(100%, 467px)"
                {...register('name', {
                  required: 'This is required'
                })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Categories</FormLabel>
              <Input
                id="categories"
                placeholder="ex: javascript, game, people, ..."
                {...register('categories')}
              />
              <FormHelperText>
                Each tag will separate by a comma.
              </FormHelperText>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Input Values</FormLabel>
              <Upload />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Main Function</FormLabel>
              <Upload />
            </FormControl>
            <Flex w="full" justify="flex-end">
              <Button size="md" type="submit" colorScheme="blue">
                Create project
              </Button>
            </Flex>
          </VStack>
        </form>
      </Flex>
    </Container>
  )
}

export default CreateProject
