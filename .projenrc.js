const { AwsCdkTypeScriptApp, CdkApprovalLevel } = require('projen');

const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.110.0',
  cdkDependencies: ['@aws-cdk/aws-ec2', '@aws-cdk/aws-ecs', '@aws-cdk/aws-ecs-patterns', '@aws-cdk/aws-iam'],
  deps: ['path'],
  requireApproval: CdkApprovalLevel.NEVER,
  name: 'HomeWeb',
  defaultReleaseBranch: 'master',
  gitignore: ['*.DS_Store'],
  jest: false,
});

project.synth();
