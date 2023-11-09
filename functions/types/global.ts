export interface SendVoiceResponse {
  statusCode: number
  headers: {
    'Content-Type': string
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
