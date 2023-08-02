import { HStack, Text, TextProps, VStack } from '@chakra-ui/react'

const DataWithLabel = ({
  label,
  value,
  customComponent,
  leftAdornment,
  rightAdornment,
  valueProps
}: {
  label: string
  value: React.ReactNode
  customComponent?: React.ReactNode
  leftAdornment?: React.ReactNode
  rightAdornment?: React.ReactNode
  valueProps?: TextProps
}) => {
  return (
    <VStack spacing="8px" align="start" w="full">
      <Text
        textTransform="uppercase"
        fontSize="sm"
        color="gray.500"
        fontWeight="medium"
        lineHeight={5}
      >
        {label}
      </Text>
      {customComponent ? (
        customComponent
      ) : (
        <HStack spacing="8px">
          {leftAdornment}
          <Text
            fontSize="md"
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
  )
}

export default DataWithLabel
