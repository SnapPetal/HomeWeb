import {Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {RemovalPolicy} from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class CdnWebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const hostedZone = 'thonbecker.com';
    const domainName = 'cdn.thonbecker.com';
    const hostedZoneLookup = route53.HostedZone.fromLookup(
      this,
      'WebsiteHostedZone',
      {
        domainName: hostedZone,
      }
    );
    const websiteCert = new acm.Certificate(this, 'WebsiteCert', {
      domainName: domainName,
      validation: acm.CertificateValidation.fromDns(hostedZoneLookup),
    });

    const inventoryBucket = new s3.Bucket(this, 'InventoryBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    const mediaBucket = new s3.Bucket(this, 'MediaBucket', {
      removalPolicy: RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      inventories: [
        {
          frequency: s3.InventoryFrequency.DAILY,
          includeObjectVersions: s3.InventoryObjectVersion.CURRENT,
          format: s3.InventoryFormat.PARQUET,
          destination: {
            bucket: inventoryBucket,
          },
        },
      ],
    });

    const websiteDist = new cloudfront.Distribution(this, 'WebsiteDist', {
      defaultBehavior: {
        origin: new origins.S3Origin(mediaBucket),
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      domainNames: [domainName],
      certificate: websiteCert,
    });

    websiteDist.addBehavior(
      '/inventory/*.parquet',
      new origins.S3Origin(inventoryBucket),
      {
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      }
    );

    new route53.ARecord(this, 'WebisteDomainAlias', {
      zone: hostedZoneLookup,
      recordName: domainName,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(websiteDist)
      ),
    });
  }
}
