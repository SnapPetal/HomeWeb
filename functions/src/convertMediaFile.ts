import * as AWS from 'aws-sdk'
import * as sharp from 'sharp'

interface S3EventDetail {
  version: string
  bucket: {
    name: string
  }
  object: {
    key: string
    size: number
    etag: string
    sequencer: string
  }
  'request-id': string
  requester: string
  'source-ip-address': string
  reason: string
}

interface CloudWatchS3Event {
  version: string
  id: string
  'detail-type': string
  source: string
  account: string
  time: string
  region: string
  resources: string[]
  detail: S3EventDetail
}

export const handler = async (event: CloudWatchS3Event): Promise<Buffer> => {
  console.log(event)
  const bucket = event.detail.bucket.name
  const key = decodeURIComponent(event.detail.object.key.replace(/\+/g, ' '))

  const params: AWS.S3.GetObjectRequest = {
    Bucket: bucket,
    Key: key
  }

  const S3 = new AWS.S3()
  const { Body } = await S3.getObject(params).promise()
  const inputData = Body as Buffer
  return await sharp(inputData).jpeg().toBuffer()
}
