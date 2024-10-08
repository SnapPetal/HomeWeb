#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { PersonalWebStack } from "../lib/personalweb-stack";
import { CdnWebStack } from "../lib/cdnweb-stack";
import { DadJokeStack } from "../lib/dadjoke-stack";
import { MediaFileStack } from "../lib/mediaFile-stack";
import { IdpStack } from "../lib/idp-stack";

const app = new cdk.App();
new PersonalWebStack(app, "thonbecker-page-stack", {
  env: {
    account: "664759038511",
    region: "us-east-1",
  },
});
new CdnWebStack(app, "cdn-page-stack", {
  env: {
    account: "664759038511",
    region: "us-east-1",
  },
});
new DadJokeStack(app, "dad-joke-api-stack", {
  env: {
    account: "664759038511",
    region: "us-east-1",
  },
});
new MediaFileStack(app, "media-file-api-stack", {
  env: {
    account: "664759038511",
    region: "us-east-1",
  },
});
new IdpStack(app, "idp-stack", {
  env: {
    account: "664759038511",
    region: "us-east-1",
  },
});
