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

export class DadJokeStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pollyJokeLambda = new lambda.NodejsFunction(
      this,
      "PollyJokeHandler",
      {
        entry: "../functions/src/createJokeMediaFile.ts",
        runtime: Runtime.NODEJS_20_X,
      },
    );

    const pollyMediaLambda = new lambda.NodejsFunction(this, "PollyHandler", {
      runtime: Runtime.NODEJS_20_X,
      entry: "../functions/src/createMediaFile.ts",
    });

    const pollyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ["*"],
      actions: ["translate:TranslateText", "polly:SynthesizeSpeech"],
    });

    const s3Statement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ["*"],
      actions: ["s3:PutObject"],
    });

    pollyJokeLambda.addToRolePolicy(pollyStatement);
    pollyJokeLambda.addToRolePolicy(s3Statement);

    pollyMediaLambda.addToRolePolicy(pollyStatement);
    pollyMediaLambda.addToRolePolicy(s3Statement);

    const api = new HttpApi(this, "	HttpApiPolly", {
      corsPreflight: {
        allowOrigins: ["https://thonbecker.com", "https://www.thonbecker.com"],
        allowMethods: [CorsHttpMethod.POST, CorsHttpMethod.OPTIONS],
        allowHeaders: [
          "Content-Type",
          "Access-Control-Allow-Headers",
          "Access-Control-Allow-Origin",
          "Access-Control-Allow-Methods",
        ],
      },
    });

    api.addRoutes({
      path: "/joke",
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration(
        "polly-joke-lambda-integration",
        pollyJokeLambda,
      ),
    });

    api.addRoutes({
      path: "/polly",
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration(
        "polly-lambda-integration",
        pollyMediaLambda,
      ),
    });

    new CfnOutput(this, "HTTP API Url", {
      value: api.url ?? "Something went wrong with the deploy",
    });
  }
}
