import { Flex, Heading, Text, VStack, Icon } from '@chakra-ui/react'
import Container from 'components/Container'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Pie,
  AreaChart,
  Area,
  Cell,
  ResponsiveContainer
} from 'recharts'
import {
  FcBarChart,
  FcConferenceCall,
  FcGlobe,
  FcServices
} from 'react-icons/fc'
import {
  chartData,
  getChartData,
  getHighestAverageOutputUser,
  getHistoricalData,
  getNumberOfOutputByUserId,
  renderActiveShape,
  renderCustomizedLabel
} from 'helpers/compute'
import { getProjectReport } from '../../../helpers/apis'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getProjectById } from 'helpers/apis'
import { useSession } from 'next-auth/react'

const DynamicBarChart = dynamic(
  () => import('recharts').then((module) => module.BarChart),
  {
    ssr: false // Disable SSR for the LineChart component
  }
)

const DynamicPieChart = dynamic(
  () => import('recharts').then((module) => module.PieChart),
  {
    ssr: false // Disable SSR for the LineChart component
  }
)

const ProjectAnalytics = ({
  prop
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [chartData, setChartData] = useState<chartData[]>([])
  const [historicalChartData, setHistoricalChartData] = useState<any[]>([])
  const [totalChart, setTotalChart] = useState<any[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [totalOutput, setTotalOutput] = useState<any>({
    outputs: 0,
    numberOfUsers: 0,
    online: 0
  })
  const { bucketId, name: projectName, computeInfo } = prop

  const [comptueStatus, setComputeStatus] = useState<string>('running')

  const isClient = true

  const { data: session } = useSession()
  const userId = session?.user.id
  const userName = session?.user.name

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProjectReport(bucketId)

        const chartData = getChartData(
          response.data.projectReport.contributions,
          response.data.projectReport.totalOutput
        )

        if (totalOutput.outputs === computeInfo.totalInput) {
          setComputeStatus('completed')
        }

        setTotalOutput(() => {
          const { outputs, numberOfUsers } =
            response.data.projectReport.totalOutput.reduce(
              (
                accumulator: { outputs: number; numberOfUsers: number },
                obj: { numberOfOutput: number }
              ) => {
                return {
                  outputs: accumulator.outputs + obj.numberOfOutput,
                  numberOfUsers: accumulator.numberOfUsers + 1
                }
              },
              { outputs: 0, numberOfUsers: 0 }
            )

          const lastestContribution =
            response.data.projectReport.contributions[
              response.data.projectReport.contributions.length - 1
            ]

          let onlineUsers = 0
          if (Date.now() - Date.parse(lastestContribution.timestamp) < 4000) {
            onlineUsers = lastestContribution.contribution.length
          } else {
            onlineUsers = 0
          }

          return { outputs, numberOfUsers, online: onlineUsers }
        })

        setChartData(chartData)
        const userTotalOutput = getNumberOfOutputByUserId(
          response.data.projectReport.totalOutput,
          userId
        )

        setTotalChart([
          { name: userName, value: userTotalOutput },
          {
            name: 'Other',
            value: computeInfo.totalInput - userTotalOutput
          }
        ])
        const historicalData = getHistoricalData(chartData)
        setHistoricalChartData(historicalData)
      } catch (e) {
        console.error('Fetch error', e)
      }
    }

    if (comptueStatus === 'running') {
      fetchData()

      const interval = setInterval(fetchData, 3000)

      return () => {
        clearInterval(interval)
      }
    }
  }, [])

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const CustomTickFormatDate = (props: any) => {
    const date = new Date(props.payload.value)

    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    const formattedDate = formatter.format(date)

    return (
      <g transform={`translate(${props.x},${props.y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666">
          {formattedDate}
        </text>
      </g>
    )
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  return (
    <Container
      backgroundColor="gray.100"
      py="10"
      px={'10%'}
      maxW={'none'}
      flex={'wrap'}
      alignItems="normal"
    >
      <Flex
        flexWrap="wrap"
        gap="32px"
        w="full"
        justifyContent={{ base: 'center', md: 'space-between' }}
        justifyItems={'center'}
      >
        <Flex direction={'column'} maxW={600} justifyContent={'space-between'}>
          <Heading color="gray.600" size={{ base: 'lg', md: 'xl' }}>
            Volunteers Monitoring
          </Heading>

          <Heading
            color="#8884d8"
            size={'2xl'}
            textAlign={{ base: 'center', md: 'left' }}
          >
            {projectName}
          </Heading>
        </Flex>
        <Flex
          flexDir={{ base: 'column', md: 'row' }}
          border="1px solid"
          backgroundColor={'white'}
          shadow={'lg'}
          borderRadius="16px"
          borderColor="gray.200"
          justifyContent="space-around"
          alignItems={{ base: '', md: 'center' }}
          minW={{ base: 350, md: 800 }}
          minH={150}
          gap={5}
          pl={10}
          py={5}
          flexWrap="wrap"
        >
          <Flex gap={'5'} minW={200}>
            <Icon as={FcServices} w={'40px'} h={'40px'} />
            <VStack spacing="0" align={'flex-start'}>
              <Text color="gray.600" fontSize="md" lineHeight={6}>
                Status
              </Text>
              <Text
                color={comptueStatus == 'running' ? 'yellow.500' : 'green.500'}
                fontSize="lg"
                lineHeight={6}
              >
                {comptueStatus}
              </Text>
            </VStack>
          </Flex>

          <Flex gap={'5'} minW={200}>
            <Icon as={FcBarChart} w={'40px'} h={'40px'} />
            <VStack spacing="0" align={'flex-start'}>
              <Text color="gray.600" fontSize="md" lineHeight={6}>
                Total output
              </Text>
              <Text color="gray.500" fontSize="lg" lineHeight={6}>
                {totalOutput.outputs} / {computeInfo.totalInput}
              </Text>
            </VStack>
          </Flex>

          <Flex gap={'5'} minW={200}>
            <Icon as={FcConferenceCall} w={'40px'} h={'40px'} />
            <VStack spacing="0" align={'flex-start'}>
              <Text color="gray.600" fontSize="md" lineHeight={6}>
                Volunteers
              </Text>
              <Text color="gray.500" fontSize="lg" lineHeight={6}>
                {totalOutput.numberOfUsers}
              </Text>
            </VStack>
          </Flex>

          <Flex gap={'5'} minW={200}>
            <Icon as={FcGlobe} w={'40px'} h={'40px'} />
            <VStack spacing="0" align={'flex-start'}>
              <Text color="gray.600" fontSize="md" lineHeight={6}>
                Online
              </Text>
              <Text color="gray.500" fontSize="lg" lineHeight={6}>
                {totalOutput.online}
              </Text>
            </VStack>
          </Flex>
        </Flex>
      </Flex>

      {/* Absolute Throughput  */}
      <Flex
        mt={50}
        flexWrap="wrap"
        gap="32px"
        w="full"
        justifyContent={{ base: 'center', md: 'space-between' }}
        justifyItems={'center'}
      >
        <Flex
          flexDir="column"
          border="1px solid"
          backgroundColor={'white'}
          shadow={'lg'}
          borderRadius="16px"
          borderColor="gray.200"
          justifyContent={'center'}
          alignItems={'center'}
          minW={{ base: 350, md: 400 }}
        >
          {isClient && (
            <ResponsiveContainer minWidth={350} aspect={1}>
              <DynamicBarChart
                width={350}
                height={350}
                data={getHighestAverageOutputUser(chartData, userId)}
                margin={{
                  top: 30,
                  right: 30,
                  left: 20,
                  bottom: 30
                }}
                barSize={20}
              >
                <XAxis
                  dataKey="userName"
                  scale="point"
                  padding={{ left: 50, right: 50 }}
                />
                <YAxis />
                <Tooltip />
                <Legend
                  payload={[
                    {
                      value: 'Highest average contributions',
                      color: '#8884d8',
                      type: 'triangle'
                    }
                  ]}
                />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar
                  name="Output per second"
                  dataKey="average"
                  fill="#8884d8"
                  background={{ fill: '#eee' }}
                />
              </DynamicBarChart>
            </ResponsiveContainer>
          )}
        </Flex>

        {/* Relative Throughput  */}

        <Flex
          flexDir="column"
          border="1px solid"
          borderRadius="16px"
          backgroundColor={'white'}
          shadow={'lg'}
          borderColor="gray.200"
          justifyContent={'center'}
          alignItems={'center'}
          minW={{ base: 350, md: 400 }}
        >
          {isClient && (
            <ResponsiveContainer minWidth={350} aspect={1}>
              <DynamicPieChart>
                <Pie
                  name="Throughput"
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={getHighestAverageOutputUser(chartData, userId)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="average"
                  onMouseEnter={onPieEnter}
                />
                <Legend
                  payload={[
                    {
                      value: 'Relative average output',
                      color: '#8884d8',
                      type: 'triangle'
                    }
                  ]}
                  height={55}
                />
              </DynamicPieChart>
            </ResponsiveContainer>
          )}
        </Flex>

        {/* Total Output */}
        <Flex
          backgroundColor={'white'}
          shadow={'lg'}
          flexDir="column"
          border="1px solid"
          borderRadius="16px"
          borderColor="gray.200"
          justifyContent={'center'}
          alignItems={'center'}
          minW={{ base: 350, md: 400 }}
        >
          <ResponsiveContainer minWidth={350} aspect={1}>
            <DynamicPieChart>
              <Pie
                data={totalChart}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                payload={[
                  {
                    value: 'Your total output',
                    color: '#8884d8',
                    type: 'triangle'
                  }
                ]}
                height={55}
              />
            </DynamicPieChart>
          </ResponsiveContainer>
        </Flex>
        {/* Historical Throughput */}

        <Flex
          id="historical-contanier"
          w="min(100%, 100%)"
          flexDir="column"
          border="1px solid"
          borderRadius="16px"
          backgroundColor={'white'}
          shadow={'lg'}
          borderColor="gray.200"
          justifyContent={'center'}
          alignItems={'center'}
          minW={{ base: 350, md: 400 }}
          mt={{ base: '0', md: '50' }}
        >
          {isClient && (
            <ResponsiveContainer minHeight={350} minWidth={350}>
              <AreaChart
                data={historicalChartData}
                margin={{
                  top: 50,
                  right: 30,
                  left: 0,
                  bottom: 30
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tick={<CustomTickFormatDate />} />
                <YAxis />
                <Tooltip />
                <Area
                  label={'Total Output'}
                  name="Total Output"
                  type="monotone"
                  dataKey="total"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Flex>
      </Flex>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps<{
  prop: any
}> = async (context) => {
  const { projectId = '' } = context.params || {}
  const { data } = await getProjectById(projectId.toString())
  return {
    props: {
      prop: data
    }
  }
}

export default ProjectAnalytics
