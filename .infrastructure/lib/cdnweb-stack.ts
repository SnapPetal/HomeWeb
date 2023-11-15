import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { RemovalPolicy } from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as s3 from "aws-cdk-lib/aws-s3";
import { S3ToStepfunctions } from "@aws-solutions-constructs/aws-s3-stepfunctions";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as logs from "aws-cdk-lib/aws-logs";

export class CdnWebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const hostedZone = "thonbecker.com";
    const domainName = "cdn.thonbecker.com";
    const hostedZoneLookup = route53.HostedZone.fromLookup(
      this,
      "WebsiteHostedZone",
      {
        domainName: hostedZone,
      },
    );
    const websiteCert = new acm.Certificate(this, "WebsiteCert", {
      domainName: domainName,
      validation: acm.CertificateValidation.fromDns(hostedZoneLookup),
    });

    const processedMediaBucket = new s3.Bucket(this, "ProcessedMediaBucket", {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    const mediaBucket = new s3.Bucket(this, "MediaBucket", {
      removalPolicy: RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      eventBridgeEnabled: true,
    });

    const websiteDist = new cloudfront.Distribution(this, "WebsiteDist", {
      defaultBehavior: {
        origin: new origins.S3Origin(processedMediaBucket),
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      httpVersion: cloudfront.HttpVersion.HTTP3,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      domainNames: [domainName],
      certificate: websiteCert,
    });

    new route53.ARecord(this, "WebisteDomainAlias", {
      zone: hostedZoneLookup,
      recordName: domainName,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(websiteDist),
      ),
    });

    const facialSearchLambda = new lambda.NodejsFunction(
      this,
      "processMediaFile",
      {
        entry: "../functions/src/facialSearch.ts",
        logRetention: logs.RetentionDays.FIVE_DAYS,
      },
    );

    const processMediaFile = new tasks.LambdaInvoke(
      this,
      "Process Media File From Bucket",
      {
        lambdaFunction: facialSearchLambda,
      },
    );

    const definition = processMediaFile;

    new S3ToStepfunctions(this, "ProcessedMediaStepFunction", {
      existingBucketObj: mediaBucket,
      stateMachineProps: {
        timeout: Duration.minutes(5),
        stateMachineType: sfn.StateMachineType.EXPRESS,
        definitionBody: sfn.DefinitionBody.fromChainable(definition),
      },
    });
  }
}
