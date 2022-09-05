#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {HomeWebStack} from '../lib/homeweb-stack';

const app = new cdk.App();
new HomeWebStack(app, 'thonbecker-page-stack', {
  env: {
    account: '664759038511',
    region: 'us-east-1',
  },
});
