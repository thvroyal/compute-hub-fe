import {
  S3Client,
  ListObjectsCommand,
  GetObjectCommand
} from '@aws-sdk/client-s3'

const getAWSData = async (projectID: string) => {
  const S3 = new S3Client({
    region: 'ap-southeast-2',
    credentials: {
      accessKeyId: 'AKIAV6JUFBZ7HTPRPCRR',
      secretAccessKey: '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'
    }
  })

  const bucketName = 'mybucketforpando'

  const params = {
    Bucket: bucketName,
    Prefix: projectID
  }

  const data: Record<string, string> = {}

  try {
    const response = await S3.send(new ListObjectsCommand(params))
    const objects = response.Contents

    if (objects) {
      await Promise.allSettled(
        objects.map(async (object) => {
          if (object.Key?.includes('source')) {
            const response = await S3.send(
              new GetObjectCommand({
                Bucket: bucketName,
                Key: object.Key
              })
            )
            const source = await response.Body?.transformToString()
            if (source) {
              data['source.js'] = source
            }
          }
        })
      )
      console.log(data)
      return data
    }
  } catch (error) {
    console.log(error)
    throw new Error()
  }
}

const handleRun = async (startFunc: any, port: string) => {
  try {
    // Hardcoded
    const projectID = '123_456'
    console.log(projectID)
    const data = await getAWSData(projectID)
    if (data) {
      eval(data['source.js'])
      eval(`window.pando.config.port = ${port}`)
    }
    startFunc()
  } catch (error) {
    console.log(error)
    throw error // Throw the error to be caught by the caller
  }
}

export default handleRun
