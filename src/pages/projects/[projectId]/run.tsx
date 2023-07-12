import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import Container from 'components/Container'
import DataWithLabel from 'components/DataWithLabel'
import { DotIcon, LoadingIcon } from 'components/Icons'
import { Author } from 'components/ProjectCard/States'
import Logs, { LogsProps } from 'components/Table/Logs'
import { getProjectById } from 'helpers/apis'
import { getPresignedUrl } from 'libs/aws'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Script from 'next/script'
import { useEffect, useState, useRef } from 'react'
import { useStopwatch } from 'react-timer-hook'
import animations from 'theme/animations'
import { formatStopWatch } from 'utils/formatData'
import { ReportStatus, calculate } from 'helpers/compute'
import { useSession } from 'next-auth/react'

declare global {
  interface Window {
    bundle: any
    volunteer: any
  }
}

enum Status {
  LOADING = 'Loading bundle...',
  DISCONNECTED = 'Disconnected',
  RUNNING = 'Running',
  ERROR = 'Error',
  READY = 'Ready'
}

const statusColor = {
  [Status.LOADING]: 'gray.500',
  [Status.DISCONNECTED]: 'red.500',
  [Status.RUNNING]: 'green.500',
  [Status.ERROR]: 'red.500',
  [Status.READY]: 'yellow.500'
}

const MAX_SCRIPTS = 2

const initialStatus: ReportStatus = {
  cpuTime: 0,
  dataTransferTime: 0,
  nbItems: 0,
  throughput: 0,
  throughputs: [],
  throughputStats: {
    average: 0,
    'standard-deviation': 0,
    maximum: 0,
    minimum: 0
  },
  cpuUsage: 0,
  cpuUsages: [],
  cpuUsageStats: {
    average: 0,
    'standard-deviation': 0,
    maximum: 0,
    minimum: 0
  },
  dataTransferLoad: 0,
  dataTransferLoads: [],
  dataTransferStats: {
    average: 0,
    'standard-deviation': 0,
    maximum: 0,
    minimum: 0
  }
}

const RunProject = ({
  bundleFile,
  project,
  environment
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [restarting, setRestarting] = useState<boolean>(false)
  const [status, setStatus] = useState<Status>(Status.LOADING)
  const [numOfScriptLoaded, setNumOfScriptLoaded] = useState<number>(0)
  const [logs, setLogs] = useState<LogsProps['data']>([] as LogsProps['data'])
  const {
    seconds,
    minutes,
    hours,
    start: startStopWatch,
    pause,
    reset
  } = useStopwatch()
  const [reportStatus, setReportStatus] = useState<ReportStatus>(initialStatus)
  const [submitState, setSubmitState] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)
  const { data: session } = useSession()

  const userId = session?.user.id

  const url =
    environment === 'production'
      ? `ws://${project?.host.replace('\n', '')}:${project?.port}`
      : `ws://localhost:${project?.port}`

  let processor: any = null
  let connectTimeout: any

  const restart = () => {
    if (!restarting) {
      console.log('restart now ...')
      setRestarting(true)
      if (processor) {
        processor.close()
        setStatus(Status.DISCONNECTED)
        pause()
      }
      processor = null
    }
  }

  const start = () => {
    processor = null
    setTimeout(() => {
      console.log('connecting over WebSocket')

      processor = window.volunteer['websocket'](
        `${url}/volunteer`,
        window.bundle
      )
      console.log(processor)

      processor.on('status', (summary: any) => {
        console.log(summary)
      })

      processor.on('close', () => {
        pause()
        setStatus(Status.DISCONNECTED)
        console.log('closed')
      })

      processor.on('error', (err: any) => {
        restart()
        setStatus(Status.ERROR)
        console.log(err)
      })

      processor.on('ready', () => {
        setStatus(Status.RUNNING)
        reset()
        startStopWatch()
        clearTimeout(connectTimeout)
      })

      processor.on('log', (value: any) => {
        setLogs((current) => [value, ...current])
      })

      processor.on('deltaTime', (value: number) => {
        report(value)
      })

      console.log('setting restart timeout')
      connectTimeout = setTimeout(() => {
        console.log('connection timeout')
      }, 30 * 1000)
    }, Math.floor(Math.random() * 1000))

    const monitoringSocket = new WebSocket(`${url}/volunteer-monitoring`)
    socketRef.current = monitoringSocket

    monitoringSocket.onopen = () => {
      console.log('Connected to report status at ' + url)
    }
    monitoringSocket.onclose = () => {
      monitoringSocket.close()
      console.log('Connection closed at ' + url)
    }
    monitoringSocket.onerror = () => {
      monitoringSocket.close()
      console.log('Connection closed at ' + url)
    }

    return () => {
      monitoringSocket.close()
    }
  }

  const submit = (info: ReportStatus) => {
    const { dataTransferLoads, throughputs, cpuUsages, ...sendData } = info
    const reportData = {
      userId: userId,
      ...sendData
    }
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify(reportData))
    }
  }

  useEffect(() => {
    setReportStatus((prev) => ({
      ...prev,
      nbItems: 0,
      cpuTime: 0,
      dataTransferTime: 0
    }))
  }, [submitState])

  useEffect(() => {
    const interval = setInterval(() => {
      setReportStatus((prevStatus) => {
        const updatedStatus = { ...prevStatus }
        calculate(updatedStatus, setReportStatus)
        submit(updatedStatus)
        return updatedStatus
      })
      setSubmitState((prevState) => !prevState)
    }, 3002)

    return () => clearInterval(interval)
  }, [submitState])

  const report = (deltaTime: number) => {
    setReportStatus((prevStatus) => ({
      ...prevStatus,
      nbItems: prevStatus.nbItems + 1,
      cpuTime: prevStatus.cpuTime + deltaTime,
      dataTransferTime: prevStatus.dataTransferTime + 0
    }))
  }

  const handleClick = async () => {
    if (numOfScriptLoaded === MAX_SCRIPTS) {
      if (status !== Status.RUNNING) {
        start()
      } else if (processor) {
        processor.terminate()
        setStatus(Status.DISCONNECTED)
        pause()
        processor = null
      }
    }
  }

  const handleScriptLoad = () => {
    setNumOfScriptLoaded((prev) => prev + 1)
  }

  useEffect(() => {
    if (numOfScriptLoaded === MAX_SCRIPTS) {
      setStatus(Status.READY)
    }
  }, [numOfScriptLoaded])

  const starting = status === Status.RUNNING
  const timer = formatStopWatch({ seconds, minutes, hours })

  return (
    <>
      <Script
        src={`/static/volunteer.js?timestamp=${new Date().getTime()}`}
        onLoad={handleScriptLoad}
      />
      <Script src={bundleFile} onLoad={handleScriptLoad} />
      <Container my="60px">
        <Flex flexWrap="wrap" gap="36px" w="full">
          <Flex
            w="min(100%, 500px)"
            flexDir="column"
            gap="32px"
            p="32px"
            border="1px solid"
            borderRadius="16px"
            borderColor="gray.200"
          >
            <Heading size="lg">Amicable Numbers</Heading>
            <Text fontSize="md" lineHeight={6} color="gray.500">
              Amicable Numbers is an independent research project that uses
              Internet-connected computers to find new amicable pairs
            </Text>
            <Author name="thvroyal" avatarSrc="" />
          </Flex>
          <VStack spacing="24px" w="min(100%, 500px)">
            <Flex justify="space-between" w="full">
              <DataWithLabel
                label="Status"
                value={status}
                valueProps={{ color: statusColor[status] }}
                leftAdornment={
                  <DotIcon
                    w="12px"
                    h="12px"
                    color={statusColor[status]}
                    animation={
                      status === Status.RUNNING
                        ? `${animations.flash} 1s infinite linear reverse`
                        : ''
                    }
                  />
                }
              />
              <DataWithLabel label="Platform" value="100" />
              <DataWithLabel
                label="Duration"
                value={timer}
                rightAdornment={
                  starting ? (
                    <LoadingIcon
                      color="gray.500"
                      animation={
                        starting
                          ? `${animations.rotation} 4s infinite linear`
                          : ''
                      }
                    />
                  ) : undefined
                }
              />
            </Flex>
            <DataWithLabel
              label="Url"
              value="http://localhost:3000/projects/6479766078ef1e038b8a0097"
            />
            <Flex justify="space-between" w="full">
              <DataWithLabel
                label="Throughput"
                value={reportStatus.throughput}
              />
              <DataWithLabel label="CPU Usage" value={reportStatus.cpuUsage} />
              <DataWithLabel
                label="Data TransferLoad"
                value={reportStatus.dataTransferLoad}
              />
            </Flex>
          </VStack>
          {project?.host && (
            <Button
              onClick={handleClick}
              w="full"
              flex="1"
              minW="150px"
              colorScheme={starting ? 'red' : 'blue'}
            >
              {starting ? 'Terminate' : 'Start'}
            </Button>
          )}
        </Flex>
        <VStack spacing="24px" w="full" mt="60px" align="start">
          <Heading size="md">Computing Logs</Heading>
          <Logs data={logs} tableContainerProps={{ maxH: '500px' }} />
        </VStack>
      </Container>
    </>
  )
}

export default RunProject

export const getServerSideProps: GetServerSideProps<{
  bundleFile: string | undefined
  environment: 'production' | 'development'
  project: {
    name: string
    port: string
    host: string
  } | null
}> = async (context) => {
  const { projectId = '' } = context.params || {}
  const { data } = await getProjectById(projectId.toString())
  const bundleFile = data
    ? await getPresignedUrl(`${data.bucketId}/source.js`)
    : ''
  return {
    props: {
      bundleFile,
      project: data,
      environment:
        process.env.NODE_ENV === 'production' ? 'production' : 'development'
    }
  }
}
