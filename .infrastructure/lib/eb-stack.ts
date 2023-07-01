import {Duration, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';

export class EbStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const logGroup = new logs.LogGroup(
      this,
      'ProcessMediaStateMachineLogGroup'
    );

    const processMediaStateMachine = new sfn.StateMachine(
      this,
      'ProcessMediaStateMachine',
      {
        logs: {
          destination: logGroup,
          level: sfn.LogLevel.ALL,
        },
        timeout: Duration.minutes(5),
        stateMachineType: sfn.StateMachineType.EXPRESS,
        definitionBody: sfn.DefinitionBody.fromFile(
          '../asl/processMediaStateMachine.json',
          {}
        ),
      }
    );

    const processMediaRule = new events.Rule(this, 'ProcessMediaRule', {
      eventPattern: {
        source: ['aws.s3'],
        detailType: ['Object Created'],
      },
    });

    const dlq = new sqs.Queue(this, 'DeadLetterQueue');

    const role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
    });

    processMediaRule.addTarget(
      new targets.SfnStateMachine(processMediaStateMachine, {
        deadLetterQueue: dlq,
        role: role,
      })
    );
  }
}
