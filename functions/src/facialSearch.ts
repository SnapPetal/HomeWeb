import { Rekognition, S3 } from 'aws-sdk'
import { type S3Event } from 'aws-lambda'
import { type SendFacialSearchResponse } from '../types/global'

export const handler = async (event: S3Event): Promise<SendFacialSearchResponse> => {
  const rekognition = new Rekognition()
  const s3 = new S3()

  // Get the bucket name and key from the S3Event
  const bucket = event.Records[0].s3.bucket.name
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '))

  // Get the object from the bucket
  const data = await s3.getObject({ Bucket: bucket, Key: key }).promise()

  // Get the file data
  const fileData = data.Body

  // Convert to buffer
  const params = {
    // Collection name to store the face
    CollectionId: 'faces-collection',

    // Minimum match confidence score
    FaceMatchThreshold: 40,
    Image: {
      Bytes: fileData
    },

    // Max no of faces to return
    MaxFaces: 5
  }

  // Call rekognition api to search the input face
  return await rekognition.searchFacesByImage(params).promise().then(data => {
    return {
      statusCode: 200,
      data,
      message: 'Face recognized successfully'
    }
  }).catch(err => {
    return {
      statusCode: 500,
      data: err,
      message: 'Face recognition failed'
    }
  })
}
