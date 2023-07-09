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
import { renderActiveShape } from '../../../helpers/compute'

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

const data = [
  {
    id: 'user1',
    cpuTime: 3031,
    dataTransferTime: 0,
    nbItems: 3,
    units: 'Numbers',
    deviceName: 'LG G6 H870 2017',
    throughput: 0.999333777481679,
    throughputStats: {
      average: '0.87',
      'standard-deviation': '0.16',
      maximum: '1.00',
      minimum: '0.67'
    },
    cpuUsage: 100.96602265156562,
    cpuUsageStats: {
      average: '89.00',
      'standard-deviation': '14.07',
      maximum: '101.00',
      minimum: '67.08'
    },
    dataTransferLoad: 0,
    dataTransferStats: {
      average: '0.00',
      'standard-deviation': '0.00',
      maximum: '0.00',
      minimum: '0.00'
    }
  },
  {
    id: 'user2',
    cpuTime: 1990,
    dataTransferTime: 0,
    nbItems: 1,
    units: 'Numbers',
    deviceName: 'LG G6 H870 2017',
    throughput: 0.33344448149383127,
    throughputStats: {
      average: '0.58',
      'standard-deviation': '0.11',
      maximum: '0.67',
      minimum: '0.33'
    },
    cpuUsage: 66.35545181727242,
    cpuUsageStats: {
      average: '98.94',
      'standard-deviation': '27.49',
      maximum: '132.88',
      minimum: '62.49'
    },
    dataTransferLoad: 0,
    dataTransferStats: {
      average: '0.00',
      'standard-deviation': '0.00',
      maximum: '0.00',
      minimum: '0.00'
    }
  },
  {
    id: 'user3',
    cpuTime: 3031,
    dataTransferTime: 0,
    nbItems: 3,
    units: 'Numbers',
    deviceName: 'LG G6 H870 2017',
    throughput: 0.3,
    throughputStats: {
      average: '0.87',
      'standard-deviation': '0.16',
      maximum: '1.00',
      minimum: '0.67'
    },
    cpuUsage: 100.96602265156562,
    cpuUsageStats: {
      average: '89.00',
      'standard-deviation': '14.07',
      maximum: '101.00',
      minimum: '67.08'
    },
    dataTransferLoad: 0,
    dataTransferStats: {
      average: '0.00',
      'standard-deviation': '0.00',
      maximum: '0.00',
      minimum: '0.00'
    }
  },
  {
    id: 'user4',
    cpuTime: 3031,
    dataTransferTime: 0,
    nbItems: 3,
    units: 'Numbers',
    deviceName: 'LG G6 H870 2017',
    throughput: 0.5,
    throughputStats: {
      average: '0.87',
      'standard-deviation': '0.16',
      maximum: '1.00',
      minimum: '0.67'
    },
    cpuUsage: 100.96602265156562,
    cpuUsageStats: {
      average: '89.00',
      'standard-deviation': '14.07',
      maximum: '101.00',
      minimum: '67.08'
    },
    dataTransferLoad: 0,
    dataTransferStats: {
      average: '0.00',
      'standard-deviation': '0.00',
      maximum: '0.00',
      minimum: '0.00'
    }
  },
  {
    id: 'user5',
    cpuTime: 3031,
    dataTransferTime: 0,
    nbItems: 3,
    units: 'Numbers',
    deviceName: 'LG G6 H870 2017',
    throughput: 0.7,
    throughputStats: {
      average: '0.87',
      'standard-deviation': '0.16',
      maximum: '1.00',
      minimum: '0.67'
    },
    cpuUsage: 100.96602265156562,
    cpuUsageStats: {
      average: '89.00',
      'standard-deviation': '14.07',
      maximum: '101.00',
      minimum: '67.08'
    },
    dataTransferLoad: 0,
    dataTransferStats: {
      average: '0.00',
      'standard-deviation': '0.00',
      maximum: '0.00',
      minimum: '0.00'
    }
  }
]

interface DataPoint {
  time: number
  [key: string]: number
}

const ProjectAnalytics = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const [activeIndex, setActiveIndex] = useState(0)

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const [data2, setData] = useState<DataPoint[]>([
    {
      time: new Date().getTime(),
      'Category A': 0,
      'Category B': 0,
      'Category C': 0
    }
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      const newDataPoint = generateRandomDataPoint() // Generate a random data point
      setData((prevData) => [...prevData, newDataPoint])
    }, 1000) // Add a new data point every second

    return () => {
      clearInterval(interval)
    }
  }, [])

  const generateRandomDataPoint = (): DataPoint => {
    const categories = ['Category A', 'Category B', 'Category C']
    const newDataPoint: DataPoint = { time: new Date().getTime() }
    categories.forEach((category) => {
      newDataPoint[category] = Math.floor(Math.random() * 100) // Generate a random value for each category
    })
    return newDataPoint
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
          // gap="32px"
          // p="12px"
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
              data={data}
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
          // gap="32px"
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
                data={data}
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
          // gap="32px"
          // p="12px"
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
              data={data2}
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
                domain={['auto', 'auto']} // Adjust the domain dynamically based on the data
                tickFormatter={(time) => new Date(time).toLocaleTimeString()} // Format the x-axis tick labels
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
              {Object.keys(data2[0] || {})
                .filter((key) => key !== 'time') // Exclude the 'time' key from rendering as an area
                .map((category, index) => (
                  <Area
                    name="Historical Throughput"
                    isAnimationActive={false}
                    key={category}
                    type="monotone"
                    dataKey={category}
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
