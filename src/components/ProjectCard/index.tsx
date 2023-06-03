import { Button } from '@chakra-ui/button'
import { Image } from '@chakra-ui/image'
import { Flex, Heading, HStack, Spacer, Text, VStack } from '@chakra-ui/layout'
import { Tag } from '@chakra-ui/tag'
import { BoxIcon } from 'components/Icons'
import AWS from 'aws-sdk'

const getAWSData = (projectID: string) => {
  AWS.config.update({
    accessKeyId: 'AKIAV6JUFBZ7HTPRPCRR',
    secretAccessKey: '4abKrOR+S7x4B59WtfKWciXq+IZTBEpTm533359h',
    region: 'ap-southeast-2' // Replace with your desired AWS region
  });

  const s3 = new AWS.S3();

  const bucketName = 'mybucketforpando';

  const params = {
    Bucket: bucketName,
    Prefix: projectID
  };
  return new Promise<Record<string, string[]>>((resolve, reject) => {
    const listInput: Record<string, string[]> = {};

    s3.listObjects(params, (err: Error, data: any) => {
      if (err) {
        reject(err);
      } else {
        const getObjectPromises = data.Contents.map((object: { Key: string }) => {
          const getObjectParams = {
            Bucket: bucketName,
            Key: object.Key,
          };

          if (object.Key.includes('source') || object.Key.includes('config')) {
            return new Promise<void>((resolve, reject) => {
              s3.getObject(getObjectParams, (getObjectErr: Error, getObjectData: any) => {
                if (getObjectErr) {
                  console.error('Error retrieving object:', getObjectErr);
                  reject(getObjectErr);
                } else {
                  const parts = object.Key.split('/'); // Split the string into an array
                  const key = parts[1];
                  listInput[key] = getObjectData.Body
                  resolve();
                }
              });
            });
          } else {
            return Promise.resolve();
          }
        });

        Promise.allSettled(getObjectPromises)
          .then(() => {
            resolve(listInput);
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  });
}

const handleClick = () => {
  //Hardcoded
  const projectID = "123_456"
  getAWSData(projectID)
  .then((data) => {
    eval(data['source.js'].toString())
    return data
  })
  .then((data) => {
    const config = JSON.parse(data['config.json'].toString())
    eval(`window.pando.config.port = ${config['port']}`)
  })
  .then(() => eval('start()'))
  .catch((error) => { console.log(error); });

  // fetch('http://localhost:3000/static/bundle.js')
  //   .then((response) => response.text())
  //   .then((script) => {
  //     eval(script)
  //   })
  //   .catch((error) => {
  //     console.error('Error fetching and executing the script:', error)
  //   })

  // fetch('http://localhost:3000/static/fakeAWS.json')
  //   .then((response) => response.json())
  //   .then((response) => {
  //     const port = response.port
  //     eval(`window.pando.config.port = ${port}`)
  //   })
  //   .then(() => eval('start()'))
}

interface ProjectCardProps {
  name: string
  description: string
  image?: string
  categories?: string[]
  info?: React.ReactNode[]
}
const ProjectCard = ({
  name,
  description,
  image,
  categories,
  info
}: ProjectCardProps) => {
  return (
    <VStack
      spacing="0"
      bgColor="gray.50"
      borderRadius="2xl"
      border="1px solid"
      borderColor="blackAlpha.200"
      overflow="hidden"
    >
      {/* Header card */}
      {image && (
        <Image
          src={image}
          objectFit="cover"
          width="full"
          height="360px"
          alt={image}
        />
      )}
      <Flex
        width="min(100%, 935px)"
        direction="column"
        padding="24px 32px 10px 32px"
      >
        {/* Body card */}
        <VStack spacing="10px" align="flex-start">
          <HStack spacing="16px" pb="16px">
            <BoxIcon w="24px" h="24px" color="gray.500" />
            <Heading variant="lg" color="blue.800">
              {name}
            </Heading>
          </HStack>
          <Text fontSize="md" lineHeight={6} color="gray.500">
            {description}
          </Text>
          <HStack spacing="10px" py="16px">
            {categories?.map((category) => (
              <Tag key={category} size="md" variant="subtle" colorScheme="blue">
                {category}
              </Tag>
            ))}
          </HStack>
        </VStack>
      </Flex>
      {/* Footer card */}
      <Flex
        bgColor="blackAlpha.50"
        w="full"
        p="16px 32px"
        borderTop="1px solid"
        borderColor="blackAlpha.200"
        align="center"
      >
        <HStack spacing="42px">{info?.map((item) => item)}</HStack>
        <Spacer />
        <Button
          size="xs"
          variant="solid"
          bgColor="blackAlpha.200"
          onClick={handleClick}
        >
          Join to project
        </Button>
      </Flex>
    </VStack>
  )
}

export default ProjectCard
