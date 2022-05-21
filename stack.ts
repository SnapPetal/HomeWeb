import * as cdk from "@aws-cdk/core";
import { Duration } from "@aws-cdk/core";
import { HostedZone } from "@aws-cdk/aws-route53";
import { Certificate } from "@aws-cdk/aws-certificatemanager";
import { NextJSLambdaEdge } from "@sls-next/cdk-construct";
import { Runtime } from "@aws-cdk/aws-lambda";

export class NextStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    new NextJSLambdaEdge(this, "NextJsApp", {
      serverlessBuildOutDir: "./build",
      runtime: Runtime.NODEJS_12_X,
      memory: 1024,
      timeout: Duration.seconds(30),
      withLogging: true,
      domain: {
        domainNames: ['thonbecker.com', 'www.thonbecker.com', 'bibleverse.thonbecker.com'],
        hostedZone: HostedZone.fromHostedZoneAttributes(this, "Zone", {
          hostedZoneId: "Z0960080GF0UBO75OWWP",
          zoneName: "thonbecker.com"
        }),
        certificate: Certificate.fromCertificateArn(this, "Cert", "arn:aws:acm:us-east-1:664759038511:certificate/0545baa1-331e-4d8c-a02d-1b30d88866f2")
      }
    });
  }
}
