const { web } = require('projen');
const project = new web.NextJsProject({
  defaultReleaseBranch: 'main',
  name: 'HomeWeb',

  // deps: [],                          /* Runtime dependencies of this module. */
  // description: undefined,            /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],                       /* Build dependencies for this module. */
  // packageName: undefined,            /* The "name" in package.json. */
  // projectType: ProjectType.UNKNOWN,  /* Which type of project this is (library/app). */
  // release: undefined,                /* Add release management to this project. */
  // tailwind: true,                    /* Setup Tailwind CSS as a PostCSS plugin. */
});
project.synth();