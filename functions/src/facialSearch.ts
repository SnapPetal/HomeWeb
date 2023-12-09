import { Rekognition } from 'aws-sdk'
import { type SendFacialSearchResponse } from '../types/global'

export const handler = async (fileData: Buffer): Promise<SendFacialSearchResponse> => {
  const rekognition = new Rekognition()

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
