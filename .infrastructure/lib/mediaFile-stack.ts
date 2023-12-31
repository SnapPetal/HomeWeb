import { Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as iam from "aws-cdk-lib/aws-iam";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Construct } from "constructs";
import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from "aws-cdk-lib/aws-apigatewayv2";
import { Runtime } from "aws-cdk-lib/aws-lambda";

export class MediaFileStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const processMediaFileLambda = new lambda.NodejsFunction(
      this,
      "ProcessMediaFileHandler",
      {
        entry: "../functions/src/processMediaFile.ts",
        runtime: Runtime.NODEJS_20_X,
      },
    );

    processMediaFileLambda.role?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3ReadOnlyAccess"),
    );

    const api = new HttpApi(this, "	HttpApiMediaFile", {
      corsPreflight: {
        allowOrigins: ["https://thonbecker.com", "https://www.thonbecker.com"],
        allowMethods: [CorsHttpMethod.GET, CorsHttpMethod.OPTIONS],
        allowHeaders: [
          "Content-Type",
          "Access-Control-Allow-Headers",
          "Access-Control-Allow-Origin",
          "Access-Control-Allow-Methods",
        ],
      },
    });

    api.addRoutes({
      path: "/",
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        "media-file-lambda-integration",
        processMediaFileLambda,
      ),
    });

    new CfnOutput(this, "HTTP API Url", {
      value: api.url ?? "Something went wrong with the deploy",
    });
  }
}
