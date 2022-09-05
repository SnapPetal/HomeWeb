const {Polly, Translate, S3, config} = require('aws-sdk');

exports.handler = async function (event: any) {
  // Default to Matthew voice and add some default text
  let text =
    event?.body ??
    'To hear your own script, you need to include text in the message body of your restful request to the API Gateway';
  const voice = event?.queryStringParameters?.voice ?? 'Matthew';
  const translateFrom = event?.queryStringParameters?.translateFrom ?? 'en';
  const translateTo = event?.queryStringParameters?.translateTo ?? 'en';

  const validVoices = ['Joanna', 'Matthew', 'Lupe'];

  if (!validVoices.includes(voice)) {
    sendRes(400, 'Only Joanna, Matthew and Lupe support the newscaster style');
  }

  // If we passed in a translation language, use translate to do the translation
  if (translateTo !== translateFrom) {
    const translate = new Translate();

    const translateParams = {
      Text: text,
      SourceLanguageCode: translateFrom,
      TargetLanguageCode: translateTo,
    };

    const rawTranslation = await translate
      .translateText(translateParams)
      .promise();
    text = rawTranslation.TranslatedText;
  }

  // Use Polly to translate text into speech

  const polly = new Polly();
  const params = {
    OutputFormat: 'ogg_vorbis',
    Engine: 'neural',
    TextType: 'ssml',
    Text: `<speak><amazon:domain name="news">${text}></amazon:domain></speak>`,
    VoiceId: voice,
  };

  const synthesis = await polly.synthesizeSpeech(params).promise();

  const now = new Date();
  config.update({region: 'us-east-1'});
  const s3 = new S3({apiVersion: '2006-03-01'});

  const uploadParams = {
    Bucket: 'thonbecker-page-stack-websitebucket75c24d94-laa1zz4sut65',
    Body: synthesis.AudioStream,
    Key: `dadjokes/${now.getFullYear()}${now.getMonth()}${now.getDate()}.ogg`,
  };

  // call S3 to retrieve upload file to specified bucket
  const response = await s3.upload(uploadParams).promise();
  return sendVoiceRes(200, JSON.stringify(response));
};

const sendVoiceRes = (status: number, body: string) => {
  const response = {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers':
        'Content-Type,Access-Control-Allow-Headers,Access-Control-Allow-Origin,Access-Control-Allow-Methods',
      'Access-Control-Allow-Origin':
        'https://www.thonbecker.com,https://thonbecker.com',
      'Access-Control-Allow-Methods': 'OPTIONS,GET',
    },
    body: body,
    isBase64Encoded: false,
  };
  return response;
};

const sendRes = (status: number, body: string) => {
  const response = {
    statusCode: status,
    headers: {
      'Content-Type': 'text/html',
    },
    body: body,
  };
  return response;
};
