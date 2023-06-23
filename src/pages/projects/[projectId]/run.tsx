import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import Container from 'components/Container'
import { Author } from 'components/ProjectCard/States'
import { getPresignedUrl } from 'libs/aws'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Script from 'next/script'
import { useEffect, useState } from 'react'

declare global {
  interface Window {
    bundle: any
    volunteer: any
  }
}

const DataWithLabel = ({
  label,
  value,
  customComponent
}: {
  label: string
  value: React.ReactNode
  customComponent?: React.ReactNode
}) => {
  return (
    <VStack spacing="8px" align="start" w="full">
      <Text
        textTransform="uppercase"
        fontSize="sm"
        color="gray.500"
        fontWeight="medium"
        lineHeight={5}
      >
        {label}
      </Text>
      {customComponent ? (
        customComponent
      ) : (
        <Text fontSize="md" color="gray.900" fontWeight="medium" w="full">
          {value}
        </Text>
      )}
    </VStack>
  )
}

const MAX_SCRIPTS = 2

const RunProject = ({
  bundleFile
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [starting, setStarting] = useState<boolean>(false)
  const [restarting, setRestarting] = useState<boolean>(false)
  let numOfScriptLoaded = 0
  let processor: any = null
  let connectTimeout: any

  const restart = () => {
    if (!restarting) {
      console.log('restart now ...')
      setRestarting(true)
      if (processor) {
        processor.close()
        setStarting(false)
      }
      processor = null
    }
  }

  const start = () => {
    processor = null
    setTimeout(() => {
      console.log('connecting over WebSocket')
      const url = 'ws://192.168.0.199:8000/volunteer'
      processor = window.volunteer['websocket'](url, window.bundle)

      processor.on('status', (summary: any) => {
        console.log(summary)
      })

      processor.on('close', () => {
        setStarting(false)
        console.log('closed')
      })

      processor.on('error', (err: any) => {
        restart()
        console.log(err)
      })

      processor.on('ready', () => {
        setStarting(true)
        clearTimeout(connectTimeout)
      })

      processor.on('input', (value: any) => {
        console.log('input', new TextDecoder().decode(value))
      })

      processor.on('output', (value: any) => {
        console.log('output', value)
      })

      console.log('setting restart timeout')
      connectTimeout = setTimeout(() => {
        console.log('connection timeout')
      }, 30 * 1000)
    }, Math.floor(Math.random() * 1000))
  }

  const handleClick = async () => {
    if (numOfScriptLoaded === MAX_SCRIPTS) {
      start()
    }
  }

  const handleScriptLoad = () => {
    numOfScriptLoaded += 1
  }

  return (
    <>
      <Script src="/static/volunteer.js" onLoad={handleScriptLoad} />
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
              <DataWithLabel label="Status" value="Connected" />
              <DataWithLabel label="Platform" value="100" />
              <DataWithLabel label="Duration" value="100" />
            </Flex>
            <DataWithLabel
              label="Url"
              value="http://localhost:3000/projects/6479766078ef1e038b8a0097"
            />
          </VStack>
          <Button
            onClick={handleClick}
            w="full"
            flex="1"
            minW="150px"
            colorScheme="blue"
          >
            Start
          </Button>
        </Flex>
        <VStack spacing="24px" w="full" mt="60px" align="start">
          <Heading size="lg">Logs</Heading>
        </VStack>
      </Container>
    </>
  )
}

export default RunProject

export const getServerSideProps: GetServerSideProps<{
  bundleFile: string | undefined
}> = async (context) => {
  const { projectId } = context.params || {}
  const bundleFile = await getPresignedUrl('123_456/source.js')
  return {
    props: {
      bundleFile
    }
  }
}
