import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CreateCloudfrontSite } from 'cdk-simplewebsite-deploy';

export class CdnWebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new CreateCloudfrontSite(this, 'public-website', {
      websiteFolder: '../cdn/',
      indexDoc: 'index.html',
      hostedZone: 'thonbecker.com',
      domain: 'cdn.thonbecker.com',
    });
  }
}
