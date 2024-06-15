import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";

export class IdpStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const personalUserPool = new cognito.UserPool(this, "personalUserpool", {
      userPoolName: "personalUserpool",
      selfSignUpEnabled: true,
      autoVerify: { email: false },
      signInAliases: { email: true },
      standardAttributes: {
        fullname: {
          required: true,
          mutable: true,
        },
      },
    });

    const zone = route53.HostedZone.fromLookup(this, "Zone", {
      domainName: "thonbecker.com",
    });
    const cert = new acm.Certificate(this, "Certificate", {
      domainName: "id.thonbecker.com",
      validation: acm.CertificateValidation.fromDns(zone),
    });
    const personalUserPoolDomain = personalUserPool.addDomain("CustomDomain", {
      customDomain: {
        domainName: "id.thonbecker.com",
        certificate: cert,
      },
    });
    new route53.ARecord(this, "AliasRecord", {
      zone: zone,
      recordName: "id.thonbecker.com",
      target: route53.RecordTarget.fromAlias(
        new route53Targets.UserPoolDomainTarget(personalUserPoolDomain),
      ),
    });
    personalUserPool.addClient("endurance-app-client-base", {
      generateSecret: true,
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.OPENID],
        callbackUrls: [
          "https://endurance.thonbecker.solutions/login/oauth2/code/endurance",
        ],
        logoutUrls: ["https://endurance.thonbecker.solutions/logout"],
      },
    });
    personalUserPool.addClient("endurance-app-client-global", {
      generateSecret: true,
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.OPENID],
        callbackUrls: [
          "https://global.thonbecker.solutions/login/oauth2/code/global",
        ],
        logoutUrls: ["https://global.thonbecker.solutions/logout"],
      },
    });
    personalUserPool.addClient("endurance-app-client-local", {
      generateSecret: true,
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.OPENID],
        callbackUrls: ["http://localhost:8080/login/oauth2/code/local"],
        logoutUrls: ["https://localhost.solutions/logout"],
      },
    });
  }
}
