import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns';
import * as iam from '@aws-cdk/aws-iam';
import { App, Construct, Stack, StackProps } from '@aws-cdk/core';

interface HomePageProps extends StackProps {
  webSiteFolder: string;
}

export class HomePageStack extends Stack {
  constructor(scope: Construct, id: string, props: HomePageProps) {
    super(scope, id, props);

    const taskRole = new iam.Role(this, 'fargate-test-task-role', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    // Define a fargate task with the newly created execution and task roles
    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      'fargate-task-definition',
      {
        taskRole: taskRole,
        executionRole: taskRole,
      },
    );

    // Import a local docker image and set up logger
    const container = taskDefinition.addContainer(
      'fargate-test-task-container',
      {
        image: ecs.ContainerImage.fromRegistry(
          '664759038511.dkr.ecr.us-east-2.amazonaws.com/snappetal/home-page:latest',
        ),
        logging: new ecs.AwsLogDriver({
          streamPrefix: 'fargate-test-task-log-prefix',
        }),
      },
    );

    container.addPortMappings({
      containerPort: 80,
      hostPort: 80,
      protocol: ecs.Protocol.TCP,
    });

    const vpc = new ec2.Vpc(this, 'fargate-test-task-vpc', {
      maxAzs: 2,
      natGateways: 1,
    });

    // Create the cluster
    const cluster = new ecs.Cluster(this, 'fargate-test-task-cluster', { vpc });

    // Create a load-balanced Fargate service and make it public
    new ApplicationLoadBalancedFargateService(
      this,
      'FargateService',
      {
        cluster: cluster, // Required
        cpu: 512, // Default is 256
        desiredCount: 2, // Default is 1
        taskDefinition: taskDefinition,
        memoryLimitMiB: 2048, // Default is 512
        publicLoadBalancer: true,
      },
    );
  }
}

const prodEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new HomePageStack(app, 'home-page-stack', {
  env: prodEnv,
  webSiteFolder: './src/website',
});

app.synth();
