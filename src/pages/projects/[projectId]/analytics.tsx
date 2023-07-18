import { Flex, Heading } from '@chakra-ui/react'
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
  Area
} from 'recharts'
import {
  chartData,
  getChartData,
  getHighestAverageOutputUser,
  getHistoricalData,
  renderActiveShape
} from 'helpers/compute'
import { getProjectReport } from '../../../helpers/apis'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getProjectById } from 'helpers/apis'

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
  const [activeIndex, setActiveIndex] = useState(0)
  const isClient = true
  const { bucketId, name: projectName } = prop

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProjectReport(bucketId)

        const chartData = getChartData(response.data.projectReport)
        setData(chartData)
        const historicalData = getHistoricalData(chartData)
        setHistoricalChartData(historicalData)
        // console.log(chartData)
        // console.log(historicalData)
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

  const CustomTickFormatData = (props: any) => {
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

  return (
    <Container my="10">
      <Heading pb={10}>Volunteers Monitoring</Heading>

      <Heading color="#8884d8" pb={10}>
        {projectName}
      </Heading>

      {/* Absolute Throughput  */}

      <Flex
        flexWrap="wrap"
        gap="32px"
        w="full"
        justifyContent={'space-between'}
      >
        <Flex
          w="min(100%, 45%)"
          flexDir="column"
          border="1px solid"
          borderRadius="16px"
          borderColor="gray.200"
          justifyContent={'center'}
          alignItems={'center'}
        >
          {isClient && (
            <DynamicBarChart
              width={500}
              height={400}
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
          )}
        </Flex>

        {/* Relative Throughput  */}

        <Flex
          w="min(100%, 45%)"
          flexDir="column"
          border="1px solid"
          borderRadius="16px"
          borderColor="gray.200"
          justifyContent={'center'}
          alignItems={'center'}
        >
          {isClient && (
            <DynamicPieChart width={500} height={400}>
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
          )}
        </Flex>

        {/* Historical Throughput */}

        <Flex
          w="min(100%, 100%)"
          flexDir="column"
          border="1px solid"
          borderRadius="16px"
          borderColor="gray.200"
          justifyContent={'center'}
          alignItems={'center'}
          mt={50}
        >
          {isClient && (
            <AreaChart
              width={1200}
              height={400}
              data={historicalChartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tick={<CustomTickFormatData />} />
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
