import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { RemovalPolicy } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import * as s3 from "aws-cdk-lib/aws-s3";
import path = require("path");

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
    });

    // Add the specified bucket policy
    mediaBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        sid: "AWSRekognitionS3AclBucketRead20191011",
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal("rekognition.amazonaws.com")],
        actions: ["s3:GetBucketAcl", "s3:GetBucketLocation"],
        resources: [mediaBucket.bucketArn],
      }),
    );

    mediaBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        sid: "AWSRekognitionS3GetBucket20191011",
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal("rekognition.amazonaws.com")],
        actions: [
          "s3:GetObject",
          "s3:GetObjectAcl",
          "s3:GetObjectVersion",
          "s3:GetObjectTagging",
        ],
        resources: [`${mediaBucket.bucketArn}/*`],
      }),
    );

    mediaBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        sid: "AWSRekognitionS3ACLBucketWrite20191011",
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal("rekognition.amazonaws.com")],
        actions: ["s3:GetBucketAcl"],
        resources: [mediaBucket.bucketArn],
      }),
    );

    mediaBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        sid: "AWSRekognitionS3PutObject20191011",
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal("rekognition.amazonaws.com")],
        actions: ["s3:PutObject"],
        resources: [`${mediaBucket.bucketArn}/*`],
        conditions: {
          StringEquals: {
            "s3:x-amz-acl": "bucket-owner-full-control",
          },
        },
      }),
    );

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
  }
}
