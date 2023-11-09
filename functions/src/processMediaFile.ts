import { type APIGatewayProxyEvent } from 'aws-lambda'

export const handler = async (event: APIGatewayProxyEvent): Promise<string> => {
  console.log(event)
  return 'This is a test'
}
