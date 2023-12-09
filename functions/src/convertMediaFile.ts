import * as AWS from 'aws-sdk';
import * as sharp from 'sharp';

type S3Detail = {
  eventVersion: string;
  eventSource: string;
  awsRegion: string;
  eventTime: string;
  eventName: string;
  userIdentity: {
    principalId: string;
  };
  requestParameters: {
    sourceIPAddress: string;
  };
  responseElements: {
    'x-amz-request-id': string;
    'x-amz-id-2': string;
  };
  s3: {
    s3SchemaVersion: string;
    configurationId: string;
    bucket: {
      name: string;
      ownerIdentity: {
        principalId: string;
      };
      arn: string;
    };
    object: {
      key: string;
      size: number;
      eTag: string;
      versionId: string;
      sequencer: string;
    };
  };
};

export const handler = async (event: S3Detail): Promise<Buffer> => {
  console.log(event);
  const bucket = event.s3.bucket.name;
  const key = decodeURIComponent(event.s3.object.key.replace(/\+/g, ' '));

  const params: AWS.S3.GetObjectRequest = {
    Bucket: bucket,
    Key: key
  };

  const S3 = new AWS.S3();
  const { Body } = await S3.getObject(params).promise();
  const inputData = Body as Buffer;
  return await sharp(inputData).jpeg().toBuffer();
};
