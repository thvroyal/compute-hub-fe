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
  ThroughputData,
  getThroughput,
  renderActiveShape
} from '../../../helpers/compute'
import mock from '../../../helpers/mock.json'

const data = mock.contributions

const resultData: ThroughputData[] = []

// Push the throughput values to the result array using the getThroughput function
data.map((contribution) => {
  resultData.push(getThroughput(contribution))
})

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

const ProjectAnalytics = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const [activeIndex, setActiveIndex] = useState(0)

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const areaColors: string[] = ['#8884d8', '#82ca9d', '#ffc658']

  return (
    <Container my="10">
      <Heading pb={10}>Volunteers Monitoring</Heading>

      <Heading color="#8884d8" pb={10}>
        Project ABC_XYC
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
              data={data[data.length - 1].contribution}
              margin={{
                top: 30,
                right: 30,
                left: 20,
                bottom: 30
              }}
              barSize={20}
            >
              <XAxis
                dataKey="id"
                scale="point"
                padding={{ left: 50, right: 50 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar
                name="Absolute Throughtput"
                dataKey="throughput"
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
                // name="Throughput"
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data[data.length - 1].contribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="throughput"
                onMouseEnter={onPieEnter}
              />
              <Legend
                payload={[
                  {
                    value: 'Relative Throughtput',
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
              width={1000}
              height={400}
              data={resultData}
              margin={{
                top: 40,
                right: 30,
                left: 0,
                bottom: 30
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                type="number"
                domain={['auto', 'auto']}
                tickFormatter={(time) => new Date(time).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip />
              <Legend
                payload={[
                  {
                    value: 'Historical Throughtput',
                    color: '#8884d8',
                    type: 'rect'
                  }
                ]}
              />
              {Object.keys(resultData[0] || {})
                .filter((key) => key !== 'time') // Exclude the 'time' key from rendering as an area
                .map((user, index) => (
                  <Area
                    name="Historical Throughput"
                    isAnimationActive={false}
                    key={user}
                    type="monotone"
                    dataKey={user}
                    stackId="1"
                    fill={areaColors[index % areaColors.length]}
                  />
                ))}
            </AreaChart>
          )}
        </Flex>
      </Flex>
    </Container>
  )
}

export default ProjectAnalytics
