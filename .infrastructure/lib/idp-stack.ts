import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";

export class IdpStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const personalUserPool = new cognito.UserPool(this, "personalUserpool", {
      userPoolName: "personalUserpool",
      signInCaseSensitive: false,
      signInAliases: { username: true },
      autoVerify: { email: true, phone: true },
      keepOriginal: {
        email: true,
        phone: true,
      },
      standardAttributes: {
        fullname: {
          required: true,
          mutable: false,
        },
        address: {
          required: false,
          mutable: true,
        },
      },
      mfa: cognito.Mfa.REQUIRED,
      mfaSecondFactor: {
        sms: true,
        otp: true,
      },
      passwordPolicy: {
        minLength: 12,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
        tempPasswordValidity: Duration.days(3),
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
      domainName: "auth.thonbecker.com",
      validation: acm.CertificateValidation.fromDns(zone),
    });
    personalUserPool.addDomain("CustomDomain", {
      customDomain: {
        domainName: "user.thonbecker.com",
        certificate: cert,
      },
    });
  }
}
