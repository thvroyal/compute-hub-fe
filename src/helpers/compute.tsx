import { Dispatch, SetStateAction } from 'react'
import { Sector } from 'recharts'

export interface ReportStatus {
  totalOutput: number
  cpuTime: number
  dataTransferTime: number
  nbItems: number
  throughput: number
  throughputs: number[]
  throughputStats: {
    average: number
    'standard-deviation': number
    maximum: number
    minimum: number
  }
  cpuUsage: number
  cpuUsages: number[]
  cpuUsageStats: {
    average: number
    'standard-deviation': number
    maximum: number
    minimum: number
  }
  dataTransferLoad: number
  dataTransferLoads: number[]
  dataTransferStats: {
    average: number
    'standard-deviation': number
    maximum: number
    minimum: number
  }
}

const sum = (a: number[]): number => {
  let s = 0
  for (let i = 0; i < a.length; ++i) {
    s += a[i]
  }
  return s
}

export const average = (a: number[]): number => {
  return sum(a) / a.length
}

export const standardDeviation = (a: number[]): number => {
  const avg = average(a)
  let deviations = 0
  for (let i = 0; i < a.length; ++i) {
    deviations += Math.abs(a[i] - avg)
  }
  return deviations / a.length
}

export const maximum = (a: number[]): number => {
  let max = -Infinity
  for (let i = 0; i < a.length; ++i) {
    if (a[i] > max) {
      max = a[i]
    }
  }
  return max
}

export const minimum = (a: number[]): number => {
  let min = Infinity
  for (let i = 0; i < a.length; ++i) {
    if (a[i] < min) {
      min = a[i]
    }
  }
  return min
}

interface ReportInfo {
  cpuTime: number
  dataTransferTime: number
  nbItems: number
}

export const calculate = (
  info: ReportInfo,
  setReportStatus: Dispatch<SetStateAction<ReportStatus>>
) => {
  const reportInfo = {
    cpuTime: info.cpuTime || 1000,
    dataTransferTime: info.dataTransferTime || 0,
    nbItems: info.nbItems || 0
  }

  const duration = 3000

  setReportStatus((prevStatus) => ({
    ...prevStatus,
    totalOutput: prevStatus.totalOutput,
    nbItems: prevStatus.nbItems + reportInfo.nbItems,
    cpuTime: prevStatus.cpuTime + reportInfo.cpuTime,
    dataTransferTime: prevStatus.dataTransferTime + reportInfo.dataTransferTime,
    throughput: prevStatus.nbItems / (duration / 1000),
    throughputStats: {
      maximum: Number(maximum(prevStatus.throughputs)),
      minimum: Number(minimum(prevStatus.throughputs)),
      average: Number(average(prevStatus.throughputs)),
      'standard-deviation': Number(standardDeviation(prevStatus.throughputs))
    },
    dataTransferLoad: (prevStatus.dataTransferTime / duration) * 100,
    dataTransferStats: {
      maximum: Number(maximum(prevStatus.dataTransferLoads)),
      minimum: Number(minimum(prevStatus.dataTransferLoads)),
      average: Number(average(prevStatus.dataTransferLoads)),
      'standard-deviation': Number(
        standardDeviation(prevStatus.dataTransferLoads)
      )
    },
    cpuUsage: (prevStatus.cpuTime / duration) * 100,
    cpuUsageStats: {
      maximum: Number(maximum(prevStatus.cpuUsages)),
      minimum: Number(minimum(prevStatus.cpuUsages)),
      average: Number(average(prevStatus.cpuUsages)),
      'standard-deviation': Number(standardDeviation(prevStatus.cpuUsages))
    },
    throughputs: [
      ...prevStatus.throughputs,
      prevStatus.nbItems / (duration / 1000)
    ],
    cpuUsages: [...prevStatus.cpuUsages, (prevStatus.cpuTime / duration) * 100],
    dataTransferLoads: [
      ...prevStatus.dataTransferLoads,
      (prevStatus.dataTransferTime / duration) * 100
    ]
  }))
}

export const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    average
  } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {`${average.toFixed(2)} OPS`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={payload.userName === 'You' ? '#82ca9d' : '#8884d8'}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={payload.userName === 'You' ? '#82ca9d' : '#8884d8'}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={payload.userName === 'You' ? '#82ca9d' : '#8884d8'}
        fill="none"
      />
      <circle
        cx={ex}
        cy={ey}
        r={2}
        fill={payload.userName === 'You' ? '#82ca9d' : '#8884d8'}
        stroke="none"
      />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >
        {payload.userName}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  )
}

export const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent
}: any) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export interface chartData {
  userId: string
  userName: string
  average: number
  totalOutput: number
  timestamp: number
}

export const getChartData = (data: any, numberOfOutputData: any) => {
  const expectedData: chartData[] = []

  data.reduce(
    (
      accumulator: {
        userId: string
        totalOutput: number
        userName: string
        average: number
        timestamp: number
      }[],
      obj: { contribution: any[]; timestamp: number }
    ) => {
      let tmpTotalOutput = 0
      obj.contribution.forEach((contribution) => {
        numberOfOutputData.forEach((outputData: any) => {
          if (contribution.userId === outputData.userId) {
            tmpTotalOutput = outputData.numberOfOutput
          }
        })
        const newObj = {
          userId: contribution.userId,
          totalOutput: tmpTotalOutput,
          userName: contribution.userName,
          average: contribution.throughputStats.average,
          timestamp: obj.timestamp
        }
        accumulator.push(newObj)
      })
      return accumulator
    },
    expectedData
  )

  return expectedData
}

export const getHistoricalData = (data: any) => {
  const result = Object.values(
    data.reduce(
      (
        accumulator: { [x: string]: { timestamp: number; total: number } },
        obj: { timestamp: number; average: number }
      ) => {
        const { timestamp, average } = obj
        if (accumulator[timestamp]) {
          accumulator[timestamp].total += average
        } else {
          accumulator[timestamp] = { timestamp, total: average }
        }
        return accumulator
      },
      {}
    )
  )

  return result
}

export const getHighestAverageOutputUser = (
  data: any,
  user: string | undefined
) => {
  // Group the data by user and calculate average for each user
  const userAverages = data.reduce(
    (
      accumulator: {
        [x: string]: { userId: string; userName: string; average: number }
      },
      obj: { userId: string; userName: string; average: number }
    ) => {
      if (
        !accumulator[obj.userId] ||
        accumulator[obj.userId].average < obj.average
      ) {
        accumulator[obj.userId] = {
          userId: obj.userId,
          userName: obj.userName,
          average: obj.average
        }

        if (user === obj.userId) {
          accumulator[obj.userId].userName = 'You'
        }
      }
      return accumulator
    },
    {}
  )
  // console.log(userAverages)
  // Sort the users by average in descending order
  const sortedUsers = Object.values(userAverages).sort(
    (a: any, b: any) => b.average - a.average
  )
  // Find the two different users with highest averages
  const topUsers = sortedUsers.slice(0, 4)
  // return topUsers

  console.log(topUsers)

  return topUsers
}

export const getNumberOfOutputByUserId = (data: any, id: any) => {
  const userWithMatchingId = data.find((userId: any) => userId.userId === id)
  return userWithMatchingId ? userWithMatchingId.numberOfOutput : 0
}
