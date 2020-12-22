const {
  Project,
  web,
  AwsCdkTypeScriptApp
} = require('projen');

const root = new Project({
  name: 'HomeWeb',
});

new web.ReactTypeScriptProject({
  parent: root,
  outdir: 'client',
  buildWorkflow: false,
  releaseWorkflow: false,
  rebuildBot: false,
});

new AwsCdkTypeScriptApp({
  parent: root,
  outdir: 'pipeline',
  cdkVersion: '1.80.0',
  buildWorkflow: false,
  releaseWorkflow: false,
  rebuildBot: false,
});

root.synth();
