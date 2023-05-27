import { Button } from '@chakra-ui/button'
import { FormControl } from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Flex, VStack, Text, Center } from '@chakra-ui/layout'
import { CloudUploadIcon } from 'components/Icons'
import { useRef } from 'react'

interface UploadProps {
  title?: string
  description?: string
  helperText?: React.ReactNode
}

const Upload = ({
  title = 'Click to upload or drag and drop file',
  description = 'Only support *.txt file',
  helperText
}: UploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleOpenFile = () => {
    inputRef.current?.click()
  }

  return (
    <FormControl isRequired>
      <Input type="file" hidden ref={inputRef} />
      <Flex
        w="full"
        borderStyle="dashed"
        borderWidth="1px"
        borderColor="blackAlpha.300"
        borderRadius="2xl"
        py="32px"
      >
        <Center w="full">
          <VStack spacing="12px">
            <CloudUploadIcon w="24px" h="24px" color="blue.600" />
            <VStack spacing="4px">
              <Text
                fontSize="md"
                lineHeight={6}
                fontWeight="medium"
                color="gray.800"
              >
                {title}
              </Text>
              <Text fontSize="xs" lineHeight={4} color="gray.500">
                {description}
              </Text>
            </VStack>
            <Button onClick={handleOpenFile}>Upload file</Button>
          </VStack>
        </Center>
        {helperText}
      </Flex>
    </FormControl>
  )
}

export default Upload
