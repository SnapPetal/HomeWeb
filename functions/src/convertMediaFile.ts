import * as AWS from 'aws-sdk'
import * as sharp from 'sharp'
import { type S3Event } from 'aws-lambda'

export const handler = async (event: S3Event): Promise<Buffer> => {
  console.log(event);
  const bucket = event.Records[0].s3.bucket.name
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '))

  const params: AWS.S3.GetObjectRequest = {
    Bucket: bucket,
    Key: key
  }

  const S3 = new AWS.S3()
  const { Body } = await S3.getObject(params).promise()
  const inputData = Body as Buffer
  return await sharp(inputData).jpeg().toBuffer()
}
