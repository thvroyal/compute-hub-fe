import { Image } from '@chakra-ui/image'
import {
  Button,
  Flex,
  HStack,
  Text,
  Divider,
  Spacer,
  Box,
  useToast
} from '@chakra-ui/react'
import { DragHandleIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react'
import MarkdownViewer from 'components/MarkdownView'
import AWS from 'aws-sdk'
import { set } from 'react-hook-form'

const getAWSData = (projectID: string) => {
  AWS.config.update({
    accessKeyId: 'AKIAV6JUFBZ7HTPRPCRR',
    secretAccessKey: '4abKrOR+S7x4B59WtfKWciXq+IZTBEpTm533359h',
    region: 'ap-southeast-2' // Replace with your desired AWS region
  })

  const s3 = new AWS.S3()

  const bucketName = 'mybucketforpando'

  const params = {
    Bucket: bucketName,
    Prefix: projectID
  }
  return new Promise<Record<string, string[]>>((resolve, reject) => {
    const listInput: Record<string, string[]> = {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    s3.listObjects(params, (err: Error, data: any) => {
      if (err) {
        reject(err)
      } else {
        const getObjectPromises = data.Contents.map(
          (object: { Key: string }) => {
            const getObjectParams = {
              Bucket: bucketName,
              Key: object.Key
            }

            if (
              object.Key.includes('source') ||
              object.Key.includes('config')
            ) {
              return new Promise<void>((resolve, reject) => {
                s3.getObject(
                  getObjectParams,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (getObjectErr: Error, getObjectData: any) => {
                    if (getObjectErr) {
                      console.error('Error retrieving object:', getObjectErr)
                      reject(getObjectErr)
                    } else {
                      const parts = object.Key.split('/') // Split the string into an array
                      const key = parts[1]
                      listInput[key] = getObjectData.Body
                      resolve()
                    }
                  }
                )
              })
            } else {
              return Promise.resolve()
            }
          }
        )

        Promise.allSettled(getObjectPromises)
          .then(() => {
            resolve(listInput)
          })
          .catch((error) => {
            reject(error)
          })
      }
    })
  })
}



const handleGetData = async () => {
  try {
    // Hardcoded
    const projectID = '123_456';
    const data = await getAWSData(projectID);
    eval(data['source.js'].toString());
    const config = JSON.parse(data['config.json'].toString());
    eval(`window.pando.config.port = ${config['port']}`);
    eval('start()');
  } catch (error) {
    console.log(error);
    throw error; // Throw the error to be caught by the caller
  }
};

interface Data {
  projectID: string;
  name: string;
  estimatedTime: number;
  unprocess: number;
  numberOfValues: number;
  author: string;
  createdAt: string;
}

const markdownContent = `
# Compute Hub - Volunteer Computing Central

## What is inside?

This project uses lot of stuff as:

- [NextJS](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Chakra-ui](https://chakra-ui.com/)
- [PWA](https://web.dev/progressive-web-apps/)
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Storybook](https://storybook.js.org/)
- [Eslint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Husky](https://github.com/typicode/husky)

## Getting Started

Run the development server:

`

const fakeFetchDataFromMongoDB = (): Promise<Data> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fakeData: Data =
        { projectID: "123_345", name: 'Numberic', estimatedTime: 25, unprocess: 6000, numberOfValues: 10000, author: 'Watashi', createdAt: "June 15,2023" }
      resolve(fakeData);
    }, 1000);
  });
};


const ProjectDetails = () => {

  const toast = useToast();

  const [data, setData] = useState<Data>();
  const [start, setStart] = useState(false)

  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [start]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fakeFetchDataFromMongoDB();
        setData(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleStart = async () => {
    try {
      await handleGetData();
      setStart(!start)
    } catch (e) {
      throw new Error
    }
  }

  return (
    <Flex
      m="auto"
      justifyContent="flex-start"
      maxW="container.xl"
      minH={"container.xl"}
      mt={'50px'}
    >
      {/* Left Panel */}
      <Box w={'500px'}>
        <Flex
          w="min(935px, 100%)"
          direction="column"
          style={{ gap: '10px' }}
        >
          <HStack justify={'space-between'}>
            <Text
              fontSize="4xl"
              lineHeight="10"
              fontWeight="semibold"
              color="gray.800"
            >
              {data?.name}
            </Text>
            <DragHandleIcon h={5} w={5} />
          </HStack>
          <Text fontSize="text-sm" lineHeight="5" color="gray.500" pb={10}>
            A project contains source code, inputs and some configurations.
            Then, the project will be listed on Explore Community page.
          </Text>
          <Divider />
          <Flex p={0} m={0}>
            <Text fontSize="text-sm" lineHeight="5" color="gray.800" maxW={80}>
              Unprocessed
            </Text>
            <Spacer />
            <Text fontSize="text-sm" lineHeight="5" color="gray.500">
              {data?.unprocess} / {data?.numberOfValues}
            </Text>
          </Flex>
          <Divider />
          <Flex>
            <Text fontSize="text-sm" lineHeight="5" color="gray.800" maxW={80}>
              Estimate Time
            </Text>
            <Spacer />
            <Text fontSize="text-sm" lineHeight="5" color="gray.500">
              {data?.estimatedTime}
            </Text>
          </Flex>
          <Divider />
          <Flex>
            <Text fontSize="text-sm" lineHeight="5" color="gray.800" maxW={80}>
              Author
            </Text>
            <Spacer />
            <Text fontSize="text-sm" lineHeight="5" color="gray.500">
              {data?.author}
            </Text>
          </Flex>
          <Divider />
          <Flex>
            <Text fontSize="text-sm" lineHeight="5" color="gray.800" maxW={80}>
              Created On
            </Text>
            <Spacer />
            <Text fontSize="text-sm" lineHeight="5" color="gray.500">
              {data?.createdAt}
            </Text>
          </Flex>
          <Divider />
          <Flex columnGap={6} pt={5}>

            {/* Button */}
            {!start ? (<>
              <Button colorScheme='blue' flexGrow={1} onClick={handleGetData} >Join Project</Button>
              <Button flexGrow={1}>View Analytics</Button>
            </>) : (
              <>
                <Button colorScheme='red' onClick={handleStart} flexGrow={1}>Started for: {countdown}s</Button>
              </>
            )}



          </Flex>
        </Flex>
      </Box>
      <Spacer />

      {/* Right panel */}
      <Flex direction='column'>
        <Image
          src={"https://formiz-react.com/img/social.jpg"}
          objectFit="cover"
          width="600px"
          height="300px"
          alt={'Test'}
          borderRadius={50}
          mb={16}
        />
        <MarkdownViewer markdownContent={markdownContent} />
      </Flex>
    </Flex>
  )
}

export default ProjectDetails