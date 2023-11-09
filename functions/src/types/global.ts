export interface SendVoiceResponse {
  statusCode: number
  headers: {
    'Content-Type': string
    'Access-Control-Allow-Headers': string
    'Access-Control-Allow-Origin': string
    'Access-Control-Allow-Methods': string
  }
  body: string
  isBase64Encoded: boolean
}

export interface SendResponse {
  statusCode: number
  headers: {
    'Content-Type': string
  }
  body: string
}
