const {
  Project,
  web,
  AwsCdkTypeScriptApp
} = require('projen');

const root = new Project({
  name: 'HomeWeb',
});

new web.ReactProject({
  parent: root,
  outdir: 'client',
  bundledDeps: ['@material-ui/core', '@material-ui/icons', 'react-router-dom', '@types/react-router-dom'],
  devDeps: [],
  buildWorkflow: false,
  releaseWorkflow: false,
  rebuildBot: false,
});

new AwsCdkTypeScriptApp({
  parent: root,
  outdir: 'pipeline',
  cdkVersion: '1.83.0',
  cdkVersionPinning: true,
  cdkDependencies: [],
  deps: ['cdk-simplewebsite-deploy'],
  gitignore: ['cdk.context.json'],
  buildWorkflow: false,
  releaseWorkflow: false,
  rebuildBot: false,
});

root.synth();
