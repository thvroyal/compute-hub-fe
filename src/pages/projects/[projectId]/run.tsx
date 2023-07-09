/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useEffect, useState } from 'react'
import { useStopwatch } from 'react-timer-hook'
import animations from 'theme/animations'
import { formatStopWatch } from 'utils/formatData'

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
let processor: any = null
let connectTimeout: any

const RunProject = ({
  bundleFile,
  project
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
      // for run pando locally
      // const url = `ws://localhost:${project?.port}/volunteer`
      const url = `ws://${project?.host.replace('\n', '')}:${
        project?.port
      }/volunteer`
      processor = window.volunteer['websocket'](url, window.bundle)
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
        console.log(value)
        setLogs((current) => [value, ...current])
      })

      console.log('setting restart timeout')
      connectTimeout = setTimeout(() => {
        console.log('connection timeout')
      }, 30 * 1000)
    }, Math.floor(Math.random() * 1000))
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
      project: data
    }
  }
}
