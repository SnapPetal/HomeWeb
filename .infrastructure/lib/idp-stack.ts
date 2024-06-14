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
      signInCaseSensitive: false,
      signInAliases: { username: true,
        email: true,
        phone: false,
       },
      autoVerify: { email: true },
      standardAttributes: {
        fullname: {
          required: true,
          mutable: true,
        },
        address: {
          required: true,
          mutable: true,
        },
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject:
          "Welcome to Thon Becker Solutions - Please Verify Your Email",
        emailBody:
          "Hello, and welcome to Thon Becker Solutions! To get started, please verify your email address. Your verification code is {####}.",
        emailStyle: cognito.VerificationEmailStyle.CODE,
        smsMessage:
          "Welcome to Thon Becker Solutions! Your verification code is {####}.",
      },
      userInvitation: {
        emailSubject: "You're Invited to Join Thon Becker Solutions",
        emailBody:
          "Hello {username}, you have been invited to join Thon Becker Solutions. To get started, please use the following temporary password: {####}.",
        smsMessage:
          "Hello {username}, welcome to Thon Becker Solutions. Your temporary password is {####}.",
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
      recordName: "auth.thonbecker.com",
      target: route53.RecordTarget.fromAlias(
        new route53Targets.UserPoolDomainTarget(personalUserPoolDomain),
      ),
    });
    personalUserPool.addClient("endurance-app-client", {
      generateSecret: true,
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.OPENID],
        callbackUrls: [
          "https://global.thonbecker.solutions/login/oauth2/code/cognito",
        ],
        logoutUrls: ["https://global.thonbecker.solutions/logout"],
      },
    });
  }
}
