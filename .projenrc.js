const { AwsCdkTypeScriptApp, CdkApprovalLevel } = require('projen');

const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.103.0',
  cdkVersionPinning: true,
  deps: ['cdk-simplewebsite-deploy'],
  requireApproval: CdkApprovalLevel.NEVER,
  name: 'HomeWeb',
  defaultReleaseBranch: 'master',
  gitignore: ['*.DS_Store'],
  jest: false,
});

project.synth();
