import {
  Button,
  Flex,
  Heading,
  Icon,
  Link,
  Text,
  VStack,
  useToast
} from '@chakra-ui/react'
import Container from 'components/Container'
import DataWithLabel from 'components/DataWithLabel'
import { LoadingIcon } from 'components/Icons'
import { Author } from 'components/ProjectCard/States'
import Logs, { LogsProps } from 'components/Table/Logs'
import { getProjectById, getProjectReport } from 'helpers/apis'
import { getNumberOfOutputByUserId } from 'helpers/compute'
import { getPresignedUrl } from 'libs/aws'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Script from 'next/script'
import { useEffect, useState, useRef } from 'react'
import { useStopwatch } from 'react-timer-hook'
import animations from 'theme/animations'
import { formatStopWatch } from 'utils/formatData'
import { ReportStatus, calculate } from 'helpers/compute'
import { useSession } from 'next-auth/react'
import {
  FcAbout,
  FcClock,
  FcDocument,
  FcElectronics,
  FcInfo,
  FcLink,
  FcSynchronize
} from 'react-icons/fc'
import zlib from 'zlib'

declare global {
  interface Window {
    bundle: any
    volunteer: any
  }
}

enum Status {
  LOADING = 'Loading',
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
  totalOutput: 0,
  cpuTime: 0,
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
  startTime: 0
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
  const [showFullDescription, setShowFullDescription] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)
  const { data: session } = useSession()
  const { bucketId } = project

  const userId = session?.user.id
  const userName = session?.user.name
  const toast = useToast()

  const toggleDescription = () => {
    setShowFullDescription((prev) => !prev)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProjectReport(bucketId)
        const contributedItems = getNumberOfOutputByUserId(
          response.data.projectReport.totalOutput,
          userId
        )
        setReportStatus((prevStats) => ({
          ...prevStats,
          totalOutput: contributedItems
        }))
      } catch (e) {
        console.error('Fetch error', e)
      }
    }

    fetchData()
  }, [session])

  const url =
    environment === 'production'
      ? `ws://${project?.host.replace('\n', '')}:${project?.port}`
      : `ws://localhost:${project?.port}`

  let processor: any = null
  let socket: any = null
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
    let totalOutputTmp = reportStatus.totalOutput

    setReportStatus((prevStats) => ({
      ...prevStats,
      startTime: Date.now()
    }))

    processor = null
    socket = null
    setTimeout(() => {
      ;[processor, socket] = window.volunteer['websocket'](
        `${url}/volunteer`,
        window.bundle
      )
      console.log(processor)

      processor.on('status', (summary: any) => {
        console.log(summary)
      })

      socket.on('return', (x: any) => {
        totalOutputTmp += 1
        const data = {
          output: x,
          userId: userId,
          totalOutput: totalOutputTmp
        }
        socket.send(
          zlib.gzipSync(Buffer.from(JSON.stringify(data))).toString('base64')
        )
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

      processor.on('deltaTime', (deltaTime: number) => {
        setReportStatus((prevStatus) => {
          const updatedStatus = { ...prevStatus }
          calculate(setReportStatus, deltaTime)
          submit(updatedStatus)
          setSubmitState((prev) => !prev)
          return updatedStatus
        })

        // report(deltaTime)
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
    const { throughputs, cpuUsages, ...sendData } = info
    const reportData = {
      userId: userId,
      userName: userName,
      ...sendData
    }
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(reportData))
    } else {
      console.log('WebSocket connection is not open.')
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

  const handleClick = async () => {
    if (numOfScriptLoaded === MAX_SCRIPTS) {
      if (status !== Status.RUNNING) {
        start()
      } else {
        window.location.reload()
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

  const handleCopyToClipboard = () => {
    const textarea = document.createElement('textarea')
    textarea.value = 'http://localhost:3000/projects/' + project.projectId
    document.body.appendChild(textarea)
    textarea.select()

    try {
      const successful = document.execCommand('copy')
      if (successful) {
        console.log('Text copied to clipboard!')
        toast({
          title: 'Copied to clipboard',
          description: 'Project link copied to clipboard',
          status: 'success',
          duration: 1000,
          isClosable: false
        })
      } else {
        console.error('Copying text to clipboard failed.')
      }
    } catch (error) {
      console.error('Error copying text to clipboard:', error)
    }

    // Remove the temporary textarea from the document
    document.body.removeChild(textarea)
  }

  return (
    <>
      <Script
        src={`/static/volunteer.js?timestamp=${new Date().getTime()}`}
        onLoad={handleScriptLoad}
      />
      <Script src={bundleFile} onLoad={handleScriptLoad} />
      <Container my="60px" px={4} mt={{ base: 9 }}>
        <Flex
          flexWrap="wrap"
          gap={{ md: '36px', base: '20px' }}
          w="full"
          justifyContent={'space-around'}
        >
          <Flex
            w="min(100%, 500px)"
            flexDir="column"
            gap="32px"
            p="32px"
            border="1px solid"
            borderRadius="16px"
            borderColor="gray.200"
            justifyContent="space-between"
          >
            <Heading size="lg">{project.name}</Heading>
            {project.description && (
              <Text color="gray.500" fontSize="md" lineHeight={6}>
                {showFullDescription
                  ? project.description
                  : project.description.slice(0, 160)}
                {project.description.length > 160 && (
                  <Link color="blue.500" onClick={toggleDescription}>
                    {showFullDescription ? '' : 'Read More'}
                  </Link>
                )}
              </Text>
            )}
            <Author name={project.author.name} avatarSrc="" />
          </Flex>
          <VStack
            spacing={{ md: '24px', base: '0px' }}
            w="min(100%, 600px)"
            gap={'10px'}
          >
            <Flex justify="space-between" w="full">
              <DataWithLabel
                icon={<Icon as={FcInfo} w="20px" h="20px" />}
                label="Status"
                value={status}
                valueProps={{ color: statusColor[status] }}
              />

              <DataWithLabel
                icon={<Icon as={FcAbout} w={'20px'} h={'20px'} />}
                label="Platform"
                value="Node.js"
              />
              <DataWithLabel
                icon={<Icon as={FcClock} w={'20px'} h={'20px'} />}
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
            <Flex
              justify="space-between"
              w="full"
              wordBreak="break-word"
              onClick={handleCopyToClipboard}
              cursor="pointer"
            >
              <DataWithLabel
                border={true}
                icon={<Icon as={FcLink} w={'20px'} h={'20px'} />}
                label="Url - Click to copy"
                value={'http://localhost:3000/projects/' + project.projectId}
              />
            </Flex>

            <Flex justify="space-between" w="full">
              <DataWithLabel
                icon={<Icon as={FcSynchronize} w={'20px'} h={'20px'} />}
                label="OPS"
                value={reportStatus.throughput.toFixed(5)}
              />
              <DataWithLabel
                icon={<Icon as={FcElectronics} w={'20px'} h={'20px'} />}
                label="CPU Usage"
                value={reportStatus.cpuUsage.toFixed(5)}
              />
              <DataWithLabel
                icon={<Icon as={FcDocument} w={'20px'} h={'20px'} />}
                label="My output"
                value={reportStatus.totalOutput}
              />
            </Flex>
            {project?.host && (
              <Button
                onClick={handleClick}
                w="full"
                flex="1"
                minW="150px"
                minHeight={'50px'}
                maxHeight={'50px'}
                colorScheme={starting ? 'red' : 'blue'}
              >
                {starting ? 'Terminate' : 'Start'}
              </Button>
            )}
          </VStack>
        </Flex>
        <VStack
          spacing="24px"
          w="full"
          mt="60px"
          align={{ base: 'center', md: 'start' }}
        >
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
    description: string
    name: string
    port: string
    host: string
    bucketId: string
    projectId: string
    author: any
  }
}> = async (context) => {
  const { projectId = '' } = context.params || {}
  const { data } = await getProjectById(projectId.toString())
  const bundleFile = data
    ? await getPresignedUrl(`${data.bucketId}/source.js`)
    : ''
  return {
    props: {
      bundleFile,
      project: { ...data, projectId: projectId },
      environment:
        process.env.NODE_ENV === 'production' ? 'production' : 'development'
    }
  }
}
