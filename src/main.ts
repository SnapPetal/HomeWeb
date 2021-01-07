import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import { CreateBasicSite } from 'cdk-simplewebsite-deploy';

export class BeckerGamesPageStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);
    new CreateBasicSite(this, 'beckergame-website', {
      websiteFolder: './src/website',
      indexDoc: 'index.html',
      hostedZoneDomain: 'beckergames.net',
      websiteDomain: 'beckergames.net',
      websiteSubDomain: 'www.beckergames.net',
      encryptBucket: true,
    });
  }
}

const prodEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new BeckerGamesPageStack(app, 'beckergames-page-stack', { env: prodEnv });

app.synth();
