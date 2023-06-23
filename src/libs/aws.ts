import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { fromEnv } from '@aws-sdk/credential-providers'
import { HttpRequest } from '@aws-sdk/protocol-http'
import { getSignedUrl, S3RequestPresigner } from '@aws-sdk/s3-request-presigner'
import { parseUrl } from '@aws-sdk/url-parser'
import { formatUrl } from '@aws-sdk/util-format-url'
import { Hash } from '@aws-sdk/hash-node'

// export const getAWSData = (projectID: string) => {
//   AWS.config.update({
//     accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
//     region: process.env.NEXT_PUBLIC_AWS_REGION
//   })

//   const s3 = new AWS.S3()

//   const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME || 'mybucketforpando'

//   const params = {
//     Bucket: bucketName,
//     Prefix: projectID
//   }
//   return new Promise<Record<string, string[] | undefined>>(
//     (resolve, reject) => {
//       const listInput: Record<string, string[] | undefined> = {}

//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       s3.listObjects(params, (err: Error, data: any) => {
//         if (err) {
//           reject(err)
//         } else {
//           const getObjectPromises = data.Contents.map(
//             (object: { Key: string }) => {
//               const getObjectParams = {
//                 Bucket: bucketName,
//                 Key: object.Key
//               }

//               if (
//                 object.Key.includes('source') ||
//                 object.Key.includes('config')
//               ) {
//                 return new Promise<void>((resolve, reject) => {
//                   s3.getObject(
//                     getObjectParams,
//                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//                     (
//                       getObjectErr: Error,
//                       getObjectData: AWS.S3.GetObjectOutput
//                     ) => {
//                       if (getObjectErr) {
//                         console.error('Error retrieving object:', getObjectErr)
//                         reject(getObjectErr)
//                       } else {
//                         const parts = object.Key.split('/') // Split the string into an array
//                         const key = parts[1]
//                         listInput[key] =
//                           getObjectData.Body?.toString().split('\n')
//                         resolve()
//                       }
//                     }
//                   )
//                 })
//               } else {
//                 return Promise.resolve()
//               }
//             }
//           )

//           Promise.allSettled(getObjectPromises)
//             .then(() => {
//               resolve(listInput)
//             })
//             .catch((error) => {
//               reject(error)
//             })
//         }
//       })
//     }
//   )
// }

interface S3_URL {
  region: string
  bucket: string
  key: string
}
/**
 *
 * return presigned url from aws s3 without client
 *
 * @param region
 * @param bucket
 * @param key
 * @returns
 *
 */
const createPresignedUrlWithoutClient = async ({
  region,
  bucket,
  key
}: S3_URL) => {
  const url = parseUrl(`https://${bucket}.s3.${region}.amazonaws.com/${key}`)
  const presigner = new S3RequestPresigner({
    credentials: fromEnv(),
    region,
    sha256: Hash.bind(null, 'sha256')
  })

  const signedUrlObject = await presigner.presign(new HttpRequest(url))
  return formatUrl(signedUrlObject)
}

const createPresignedUrlWithClient = ({ region, bucket, key }: S3_URL) => {
  const client = new S3Client({ region })
  const command = new GetObjectCommand({ Bucket: bucket, Key: key })
  return getSignedUrl(client, command, { expiresIn: 3600 })
}

/**
 *
 * @param pathToFile
 * @returns string | null
 */
export const getPresignedUrl = async (
  pathToFile: string
): Promise<string | undefined> => {
  const REGION = process.env.NEXT_PUBLIC_AWS_REGION || 'ap-southeast-2'
  const BUCKET = process.env.NEXT_PUBLIC_BUCKET_NAME || 'mybucketforpando'
  const KEY = pathToFile

  try {
    const clientUrl = await createPresignedUrlWithClient({
      region: REGION,
      bucket: BUCKET,
      key: KEY
    })

    return clientUrl
  } catch (err) {
    console.error(err)
    return undefined
  }
}
