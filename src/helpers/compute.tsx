import { Dispatch, SetStateAction } from 'react'
import { Sector } from 'recharts'

export interface ReportStatus {
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
    nbItems: info.nbItems || 1
  }

  const duration = 3000

  setReportStatus((prevStatus) => ({
    ...prevStatus,
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
    throughput
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
        {payload.id}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`Throughput ${throughput.toFixed(2)}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  )
}

export interface ThroughputData {
  time: number
  [key: string]: number
}

export const getThroughput = (data: any) => {
  const throughputData: ThroughputData = { time: 0 }

  data.contribution.forEach((contribution: any) => {
    const { id, throughput } = contribution
    throughputData[id] = throughput
  })

  const throughputObject = {
    ...throughputData,
    time: Date.parse(data.timestamp)
  }

  return throughputObject
}
