import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigw from '@aws-cdk/aws-apigatewayv2-alpha'
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { Construct } from 'constructs';
import { CreateCloudfrontSite } from 'cdk-simplewebsite-deploy'

export class HomeWebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Lambda Function that takes in text and returns a polly voice synthesis
    const pollyLambda = new lambda.Function(this, 'PollyHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda-fns'),
      handler: 'polly.handler'
    });

    const pollyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: [
        "translate:TranslateText",
        "polly:SynthesizeSpeech"
      ],
    });
    pollyLambda.addToRolePolicy(pollyStatement);

    // defines an API Gateway Http API resource backed by our "pollyLambda" function.
    let api = new apigw.HttpApi(this, 'Endpoint', {
      corsPreflight: {
        allowOrigins: ['https://thonbecker.com'],
      },
      defaultIntegration: new HttpLambdaIntegration('DefaultIntegration', pollyLambda),
    });

    new CfnOutput(this, 'HTTP API Url', {
      value: api.url ?? 'Something went wrong with the deploy'
    });

    new CreateCloudfrontSite(this, 'homeweb-website', {
      websiteFolder: '../public/',
      indexDoc: 'index.html',
      hostedZone: 'thonbecker.com',
      subDomain: 'www.thonbecker.com',
    });
  }
}
