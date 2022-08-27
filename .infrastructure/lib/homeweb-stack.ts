import {Stack, StackProps, CfnOutput} from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as apigw from '@aws-cdk/aws-apigatewayv2-alpha';
import {HttpLambdaIntegration} from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import {Construct} from 'constructs';
import {CreateCloudfrontSite} from 'cdk-simplewebsite-deploy';

export class HomeWebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Lambda Function that takes in text and returns a polly voice synthesis
    const pollyLambda = new lambda.NodejsFunction(this, 'PollyHandler', {
      entry: 'functions/createMediaFile.ts',
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

    pollyLambda.addToRolePolicy(pollyStatement);
    pollyLambda.addToRolePolicy(s3Statement);

    const api = new apigw.HttpApi(this, '	HttpApiPolly', {
      corsPreflight: {
        allowOrigins: ['https://thonbecker.com', 'https://www.thonbecker.com'],
        allowMethods: [apigw.CorsHttpMethod.GET, apigw.CorsHttpMethod.OPTIONS],
        allowHeaders: [
          'Content-Type',
          'Access-Control-Allow-Headers',
          'Access-Control-Allow-Origin',
          'Access-Control-Allow-Methods',
        ],
      },
      defaultIntegration: new HttpLambdaIntegration(
        'DefaultIntegration',
        pollyLambda
      ),
    });

    new CreateCloudfrontSite(this, 'public-website', {
      websiteFolder: '../public/',
      indexDoc: 'index.html',
      hostedZone: 'thonbecker.com',
      subDomain: 'www.thonbecker.com',
    });

    const publciBucket = s3.Bucket.fromBucketName(
      this,
      'website-bucket-import',
      'thonbecker-page-stack-websitebucket75c24d94-gp1qpd1m4y4p'
    );

    // 👇 create the bucket policy
    const bucketPolicy = new s3.BucketPolicy(this, 'website-bucket-policy', {
      bucket: publciBucket,
    });

    // 👇 add policy statements ot the bucket policy
    bucketPolicy.document.addStatements(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('lambda.amazonaws.com')],
        actions: ['s3:PutObject'],
        resources: [`${publciBucket.bucketArn}/dadjokes/*`],
      })
    );

    new CfnOutput(this, 'HTTP API Url', {
      value: api.url ?? 'Something went wrong with the deploy',
    });
  }
}
