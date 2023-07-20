import { Flex, Heading } from '@chakra-ui/react'
import Container from 'components/Container'
import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react'
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
  const [data, setData] = useState<chartData[]>([])
  const [historicalChartData, setHistoricalChartData] = useState<any[]>([])
  const [totalChart, setTotalChart] = useState<any[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const isClient = true
  const { bucketId, name: projectName } = prop

  const { data: session } = useSession()
  const userId = session?.user.id
  const userName = session?.user.name

  useEffect(() => {
    console.log(totalChart), [totalChart]
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProjectReport(bucketId)

        const chartData = getChartData(
          response.data.projectReport.contributions
        )
        console.log(response.data.projectReport)

        setData(chartData)
        const userTotalOutput = getNumberOfOutputByUserId(
          response.data.projectReport.totalOutput,
          userId
        )
        setTotalChart([
          { name: userName, value: userTotalOutput },
          {
            name: 'Other',
            value: response.data.projectReport.totalInput - userTotalOutput
          }
        ])
        const historicalData = getHistoricalData(chartData)
        setHistoricalChartData(historicalData)
      } catch (e) {
        console.error('Fetch error', e)
      }
    }

    fetchData()

    const interval = setInterval(fetchData, 3000)

    return () => {
      clearInterval(interval)
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
        <Flex direction={'column'} maxW={400} justifyContent={'space-between'}>
          <Heading color="gray.600">Volunteers Monitoring</Heading>

          <Heading
            color="#8884d8"
            size={{ base: '2xl', md: '3xl' }}
            textAlign={{ base: 'center', md: 'left' }}
          >
            {projectName}
          </Heading>
        </Flex>
        <Flex
          flexDir="column"
          border="1px solid"
          backgroundColor={'white'}
          shadow={'lg'}
          borderRadius="16px"
          borderColor="gray.200"
          justifyContent={'center'}
          alignItems={'center'}
          minW={{ base: 350, md: 800 }}
          minH={150}
        >
          More infomation about the project
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
          // w="min(100%, 55%)"
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
                data={getHighestAverageOutputUser(data)}
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
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar
                  name="Highest average output users"
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
          // w="min(100%, 45%)"
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
                  data={getHighestAverageOutputUser(data)}
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
                      type: 'rect'
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
          // w="min(100%, 45%)"
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
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                payload={[
                  {
                    value: 'User total output / input',
                    color: '#8884d8',
                    type: 'rect'
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
