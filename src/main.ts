import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import { CreateCloudfrontSite } from 'cdk-simplewebsite-deploy';

interface HomePageProps extends StackProps {
  webSiteFolder: string;
}

export class HomePageStack extends Stack {
  constructor(scope: Construct, id: string, props: HomePageProps) {
    super(scope, id, props);

    new CreateCloudfrontSite(this, 'home-website', {
      websiteFolder: props.webSiteFolder,
      indexDoc: 'index.html',
      hostedZoneDomain: 'thonbecker.com',
      websiteDomain: 'thonbecker.com',
      websiteSubDomain: 'www.thonbecker.com',
    });
  }
}

const prodEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new HomePageStack(app, 'home-page-stack', {
  env: prodEnv,
  webSiteFolder: './src/website',
});

app.synth();
