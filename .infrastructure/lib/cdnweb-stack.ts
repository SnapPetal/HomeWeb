import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { RemovalPolicy } from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import path = require("path");

export class CdnWebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const inventoryBucket = new s3.Bucket(this, "InventoryBucket", {
      removalPolicy: RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      lifecycleRules: [
        {
          expiration: Duration.days(30),
        },
      ],
    });

    new s3.Bucket(this, "MediaBucket", {
      removalPolicy: RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      inventories: [
        {
          frequency: s3.InventoryFrequency.WEEKLY,
          includeObjectVersions: s3.InventoryObjectVersion.CURRENT,
          destination: {
            bucket: inventoryBucket,
            prefix: "mediaInventory",
          },
        },
    });
  }
}
