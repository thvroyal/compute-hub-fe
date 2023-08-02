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
  useToast,
  VStack
} from '@chakra-ui/react'
import { BoxIcon } from 'components/Icons'
import { useForm } from 'react-hook-form'
import Upload from 'components/Form/Upload'
import { createProject } from 'helpers/apis'
import { useState } from 'react'
import { useRouter } from 'next/router'

interface FormValues {
  name: string
  categories: string
  description: string
  inputFile: FileList
  sourceFile: FileList
}
const CreateProject = () => {
  const { register, handleSubmit, watch } = useForm<FormValues>()
  const [loading, setLoading] = useState<boolean>(false)
  const toast = useToast()
  const router = useRouter()

  const onSubmit = handleSubmit(async (values) => {
    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('categories', values.categories)
    formData.append('description', values.description)
    formData.append('inputFile', values.inputFile[0])
    formData.append('sourceFile', values.sourceFile[0])
    setLoading(true)
    const { data, error } = await createProject(formData)
    setLoading(false)
    if (data) {
      toast({
        title: 'Create project successfully',
        status: 'success'
      })
      router.push(`/projects/${data.project.id}`)
    } else {
      toast({
        title: 'Create project failed',
        description: error,
        status: 'error'
      })
    }
  })

  return (
    <Container pb="36px">
      <Flex
        w="min(935px, 100%)"
        mt="64px"
        direction="column"
        style={{ gap: '32px' }}
      >
        <VStack spacing="8px" align="flex-start">
          <HStack spacing="10px">
            <BoxIcon w={8} h={8} color="blue.700" />
            <Text
              fontSize={{ md: '4xl', base: '2xl' }}
              lineHeight="10"
              fontWeight="semibold"
              color="blue.700"
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
        <form onSubmit={onSubmit} encType="multipart/form-data">
          <VStack spacing="32px">
            <FormControl isRequired>
              <FormLabel color={'blue.600'}>Project Name</FormLabel>
              <Input
                id="name"
                placeholder="Project name"
                w="min(100%, 467px)"
                {...register('name', {
                  required: 'This is required'
                })}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color={'blue.600'}>Categories</FormLabel>
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
              <FormLabel color={'blue.600'}>Description</FormLabel>
              <Input
                as="textarea"
                id="description"
                placeholder={`You can use Markdown syntax to format your text.
                
Briefly describe the main goal or purpose of the project

Explain the unique selling points of the project and how it stands out from other similar projects`}
                h="min(200px)"
                padding={'10px'}
                {...register('description', {
                  required: 'This is required'
                })}
              />
            </FormControl>
            <FormControl>
              <FormLabel color={'blue.600'}>Input Values</FormLabel>
              <Upload
                register={register('inputFile')}
                value={watch('inputFile')}
              />
            </FormControl>
            <FormControl>
              <FormLabel color={'blue.600'}>Main Function</FormLabel>
              <Upload
                register={register('sourceFile')}
                value={watch('sourceFile')}
                accept=".js"
                description="Only accept *.js file"
              />
            </FormControl>
            <Flex w="full" justify="flex-end">
              <Button
                size="md"
                type="submit"
                colorScheme="blue"
                isLoading={loading}
              >
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
