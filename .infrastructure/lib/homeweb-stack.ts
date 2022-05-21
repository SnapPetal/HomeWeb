import {Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {CreateCloudfrontSite} from 'cdk-simplewebsite-deploy'

export class HomeWebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new CreateCloudfrontSite(this, 'homeweb-website', {
      websiteFolder: '../public/',
      indexDoc: 'index.html',
      hostedZone: 'thonbecker.com',
      subDomain: 'www.thonbecker.com',
    });
  }
}
