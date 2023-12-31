import { S3 } from 'aws-sdk'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { Readable } from 'stream'
import * as csv from 'csvtojson'

const s3 = new S3()

export const handler = async (event: APIGatewayProxyEvent): Promise<string> => {
  console.log(event)
  const bucketName = 'cdn-page-stack-inventorybucketa869b8cb-4bxdk5l41ale'

  const objects = await s3.listObjectsV2({ Bucket: bucketName }).promise()

  if (objects.Contents !== undefined && objects.Contents !== null && objects.Contents.length > 0) {
    const csvFiles = objects.Contents.filter(file => file.Key !== undefined && file.Key !== null && file.Key.endsWith('.csv'))

    const latestFile = csvFiles[0]

    if (latestFile.Key !== undefined && latestFile.Key !== null && latestFile.Key.trim() !== '') {
      const file = await s3.getObject({ Bucket: bucketName, Key: latestFile.Key }).promise()

      if (file.Body !== undefined && file.Body !== null) {
        const stream = new Readable()
        stream.push(file.Body)

        const json = await csv().fromStream(stream)

        return JSON.stringify(json)
      } else {
        throw new Error('No file body found')
      }
    } else {
      throw new Error('No csv files found')
    }
  } else {
    throw new Error('No objects found')
  }
}
