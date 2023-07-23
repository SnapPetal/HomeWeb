import {Stack, StackProps, CfnOutput} from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigw from '@aws-cdk/aws-apigatewayv2-alpha';
import * as route53 from 'aws-cdk-lib/aws-route53';
import {HttpLambdaIntegration} from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import {Construct} from 'constructs';
import {CreateCloudfrontSite} from 'cdk-simplewebsite-deploy';
import {HttpMethod} from '@aws-cdk/aws-apigatewayv2-alpha';
import {HttpsRedirect} from 'aws-cdk-lib/aws-route53-patterns';

export class PersonalWebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pollyJokeLambda = new lambda.NodejsFunction(
      this,
      'PollyJokeHandler',
      {
        entry: '../functions/createJokeMediaFile.ts',
      }
    );

    const pollyMediaLambda = new lambda.NodejsFunction(this, 'PollyHandler', {
      entry: '../functions/createMediaFile.ts',
    });

    const pollyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['translate:TranslateText', 'polly:SynthesizeSpeech'],
    });

    const s3Statement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['s3:PutObject'],
    });

    pollyJokeLambda.addToRolePolicy(pollyStatement);
    pollyJokeLambda.addToRolePolicy(s3Statement);

    pollyMediaLambda.addToRolePolicy(pollyStatement);
    pollyMediaLambda.addToRolePolicy(s3Statement);

    const api = new apigw.HttpApi(this, '	HttpApiPolly', {
      corsPreflight: {
        allowOrigins: ['https://thonbecker.com', 'https://www.thonbecker.com'],
        allowMethods: [apigw.CorsHttpMethod.POST, apigw.CorsHttpMethod.OPTIONS],
        allowHeaders: [
          'Content-Type',
          'Access-Control-Allow-Headers',
          'Access-Control-Allow-Origin',
          'Access-Control-Allow-Methods',
        ],
      },
    });

    api.addRoutes({
      path: '/joke',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration(
        'polly-joke-lambda-integration',
        pollyJokeLambda
      ),
    });

    api.addRoutes({
      path: '/polly',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration(
        'polly-lambda-integration',
        pollyMediaLambda
      ),
    });

    new CreateCloudfrontSite(this, 'WebsiteHome', {
      websiteFolder: '../personal/dist',
      indexDoc: 'index.html',
      hostedZone: 'thonbecker.com',
      domain: 'www.thonbecker.com',
    });

    new HttpsRedirect(this, 'Redirect', {
      recordNames: ['thonbecker.com'],
      targetDomain: 'www.thonbecker.com',
      zone: route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
        hostedZoneId: 'Z0960080GF0UBO75OWWP',
        zoneName: 'thonbecker.com',
      }),
    });

    new CfnOutput(this, 'HTTP API Url', {
      value: api.url ?? 'Something went wrong with the deploy',
    });
  }
}
