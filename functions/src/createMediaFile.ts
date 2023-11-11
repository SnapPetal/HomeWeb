import { type APIGatewayProxyEvent } from 'aws-lambda'
import { Polly, Translate } from 'aws-sdk'
import { Buffer } from 'buffer'
import { type SendResponse, type SendVoiceResponse } from '../types/global'

export const handler = async (event: APIGatewayProxyEvent): Promise<SendVoiceResponse> => {
  // Default to Matthew voice and add some default text
  let text = event?.body ?? 'To hear your own script, you need to include text in the message body of your restful request to the API Gateway'
  const voice = event?.queryStringParameters?.voice ?? 'Matthew'
  const translateFrom = event?.queryStringParameters?.translateFrom ?? 'en'
  const translateTo = event?.queryStringParameters?.translateTo ?? 'en'

  const validVoices = ['Joanna', 'Matthew', 'Lupe']

  if (!validVoices.includes(voice)) {
    sendRes(400, 'Only Joanna, Matthew and Lupe support the newscaster style')
  }

  // If we passed in a translation language, use translate to do the translation
  if (translateTo !== translateFrom) {
    const translate = new Translate()

    const translateParams = {
      Text: text,
      SourceLanguageCode: translateFrom,
      TargetLanguageCode: translateTo
    }

    const rawTranslation = await translate.translateText(translateParams).promise()
    text = rawTranslation.TranslatedText
  }

  // Use Polly to translate text into speech

  const polly = new Polly()

  const params = {
    OutputFormat: 'mp3',
    Engine: 'neural',
    TextType: 'ssml',
    Text: text,
    VoiceId: voice
  }

  await polly.synthesizeSpeech(params).promise().then(audio => {
    if (audio.AudioStream instanceof Buffer) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'audio/mpeg'
        },
        body: audio.AudioStream.toString('base64'),
        isBase64Encoded: true
      }
    } else throw new Error('AudioStream is not a Buffer.')
  })
}

const sendRes = (status: number, body: string): SendResponse => {
  const response = {
    statusCode: status,
    headers: {
      'Content-Type': 'text/html'
    },
    body
  }
  return response
}
