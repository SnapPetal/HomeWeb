import { Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as apigw from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { Construct } from "constructs";
import { HttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
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

    const s3Statement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ["*"],
      actions: ["s3:GetObject"],
    });

    processMediaFileLambda.addToRolePolicy(s3Statement);

    const api = new apigw.HttpApi(this, "	HttpApiFamilyPictures", {
      corsPreflight: {
        allowOrigins: ["https://thonbecker.com", "https://www.thonbecker.com"],
        allowMethods: [apigw.CorsHttpMethod.GET, apigw.CorsHttpMethod.OPTIONS],
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
