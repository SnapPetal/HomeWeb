const {
  Project,
  web,
  AwsCdkTypeScriptApp,
  CdkApprovalLevel
} = require('projen');

const root = new Project({
  name: 'HomeWeb',
});

new web.ReactProject({
  parent: root,
  outdir: 'client',
  bundledDeps: ['@material-ui/core', '@material-ui/icons', 'react-router-dom', '@types/react-router-dom'],
  buildWorkflow: false,
  releaseWorkflow: false,
  rebuildBot: false,
});

new AwsCdkTypeScriptApp({
  parent: root,
  outdir: 'pipeline',
  cdkVersion: '1.85.0',
  cdkVersionPinning: true,
  deps: ['cdk-simplewebsite-deploy'],
  gitignore: ['cdk.context.json'],
  requireApproval: CdkApprovalLevel.NEVER,
  buildWorkflow: false,
  releaseWorkflow: false,
  rebuildBot: false,
});

root.synth();
