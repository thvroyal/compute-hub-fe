import { Button } from '@chakra-ui/button'
import { FormControl } from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Center, Flex, Text, VStack } from '@chakra-ui/layout'
import { CloudUploadIcon, UploadFileIcon } from 'components/Icons'
import { useRef } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import { getSize } from 'utils/formatData'

interface UploadProps {
  title?: string
  description?: string
  helperText?: React.ReactNode
  register: UseFormRegisterReturn
  value: FileList
  accept?: string
}

const Upload = ({
  title = 'Click to upload or drag and drop file',
  description = 'Only support *.txt file',
  helperText,
  register,
  value,
  accept = '.txt, .csv'
}: UploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { ref, ...rest } = register
  const file = value?.[0] || null

  const handleOpenFile = () => {
    inputRef.current?.click()
  }

  return (
    <FormControl>
      <Input
        {...rest}
        type="file"
        display="none"
        ref={(e) => {
          ref(e)
          inputRef.current = e
        }}
        accept={accept}
      />
      <Flex
        w="full"
        bgColor={file ? 'blackAlpha.50' : 'white'}
        borderStyle="dashed"
        borderWidth="1px"
        borderColor="blackAlpha.300"
        borderRadius="2xl"
        py="32px"
      >
        <Center w="full">
          <VStack spacing="12px">
            {!file ? (
              <CloudUploadIcon w="24px" h="24px" color="blue.600" />
            ) : (
              <UploadFileIcon w="48px" h="48px" color="blue.600" />
            )}
            <VStack spacing="4px">
              <Text
                textAlign={'center'}
                mx={'20px'}
                fontSize="md"
                lineHeight={6}
                fontWeight="medium"
                color="gray.800"
              >
                {file ? file.name : title}
              </Text>
              <Text fontSize="xs" lineHeight={4} color="gray.500">
                {file ? getSize(file.size) : description}
              </Text>
            </VStack>
            <Button onClick={handleOpenFile} variant={file ? 'ghost' : 'solid'}>
              {file ? 'Change file' : 'Upload file'}
            </Button>
          </VStack>
        </Center>
        {helperText}
      </Flex>
    </FormControl>
  )
}

export default Upload
