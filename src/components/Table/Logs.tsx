import {
  Table,
  TableContainer,
  TableContainerProps,
  Tbody,
  Td,
  Tr
} from '@chakra-ui/react'

export interface LogsProps {
  data: {
    timestamp: string
    message: string
    type?: 'error' | 'warning' | 'info'
  }[]
  tableContainerProps?: TableContainerProps
}

const bgColorMapping = {
  error: 'red.100',
  warning: 'yellow.50',
  info: undefined
}
function Logs({ data, tableContainerProps }: LogsProps) {
  return (
    <TableContainer
      w="full"
      className="log"
      overflowY="scroll"
      {...tableContainerProps}
    >
      <Table variant="unstyled" size="sm">
        <Tbody>
          {data &&
            data.map((msg) => (
              <Tr
                key={`${msg.timestamp} + ${msg.message}`}
                cursor="pointer"
                _hover={{ background: 'blue.50' }}
                background={bgColorMapping[msg.type || 'info']}
              >
                <Td>{msg.timestamp}</Td>
                <Td w="full">{msg.message}</Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default Logs
