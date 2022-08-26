#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {HomeWebStack} from '../lib/homeweb-stack';

const app = new cdk.App();
new HomeWebStack(app, 'thonbecker-page-stack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
