import {Stack, StackProps, CfnOutput} from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import {Construct} from 'constructs';
import {CreateCloudfrontSite} from 'cdk-simplewebsite-deploy';
import {HttpsRedirect} from 'aws-cdk-lib/aws-route53-patterns';

export class PersonalWebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

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
  }
}
