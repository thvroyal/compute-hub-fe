import {
  Box,
  HStack,
  Icon,
  Text,
  TextProps,
  VStack,
  useMediaQuery
} from '@chakra-ui/react'
import { FcInfo } from 'react-icons/fc'

const DataWithLabel = ({
  label,
  value,
  customComponent,
  leftAdornment,
  rightAdornment,
  valueProps,
  icon,
  border
}: {
  label: string
  value: React.ReactNode
  customComponent?: React.ReactNode
  leftAdornment?: React.ReactNode
  rightAdornment?: React.ReactNode
  valueProps?: TextProps
  icon?: React.ReactNode
  border?: boolean
}) => {
  const [isMd] = useMediaQuery('(min-width: 768px)')
  return (
    <Box
      border={border ? '1px solid' : 'none'}
      // border={'1px solid'}
      borderColor="gray.200"
      pl="4"
      py="4"
      borderRadius="lg"
      w="full"
    >
      <VStack spacing="8px" align="start" w="full">
        <HStack spacing="8px">
          {icon}
          <Text
            textTransform="uppercase"
            fontSize={{ base: 'xs', md: 'md' }}
            color="gray.500"
            fontWeight="medium"
            lineHeight={5}
          >
            {label}
          </Text>
        </HStack>
        {customComponent ? (
          customComponent
        ) : (
          <HStack spacing="8px">
            {isMd && (
              <Icon as={FcInfo} w="24px" h="24px" visibility={'hidden'} />
            )}
            {leftAdornment}
            <Text
              fontSize={{ base: 'md', md: 'md' }}
              color="gray.900"
              fontWeight="medium"
              w="full"
              wordBreak="break-word"
              {...valueProps}
            >
              {value}
            </Text>
            {rightAdornment}
          </HStack>
        )}
      </VStack>
    </Box>
  )
}

export default DataWithLabel
