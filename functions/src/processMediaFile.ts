import { S3 } from 'aws-sdk'
import { type APIGatewayProxyEvent } from 'aws-lambda'

const s3 = new S3()

export const handler = async (event: APIGatewayProxyEvent): Promise<string> => {
  console.log(event)
  const bucketName = 'cdn-page-stack-processedmediabucket446d3976-oonhpdwdpfzq'

  const objects = await s3.listObjectsV2({ Bucket: bucketName }).promise()

  // Extract the names of the files
  const fileNames = objects.Contents?.map(file => file.Key) ?? []

  // Filter out only .jpg and .heic files
  const filteredFileNames = fileNames.filter(fileName =>
    fileName !== null && fileName !== undefined && (fileName.endsWith('.jpg') || fileName.endsWith('.heic'))
  )

  // Return the names in a JSON format
  return JSON.stringify(filteredFileNames)
}
