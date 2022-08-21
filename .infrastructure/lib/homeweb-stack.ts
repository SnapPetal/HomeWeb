import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigw from '@aws-cdk/aws-apigatewayv2-alpha'
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { Construct } from 'constructs';
import { CreateCloudfrontSite } from 'cdk-simplewebsite-deploy'

export class HomeWebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Lambda Function that takes in text and returns a polly voice synthesis
    const pollyLambda = new lambda.NodejsFunction(this, 'PollyHandler', {
      entry: 'lambda-fns/polly.ts',
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

    let api = new apigw.HttpApi(this, '	HttpApiPolly', {
      corsPreflight: {
        allowOrigins: ['https://thonbecker.com', 'https://www.thonbecker.com'],
        allowMethods: [apigw.CorsHttpMethod.GET, apigw.CorsHttpMethod.OPTIONS]
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
