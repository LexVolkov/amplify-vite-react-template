import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import {tgBotSendMessage} from "./functions/tg-bot-send-message/resource";
import {apiFunction} from "./functions/api-function/resource";
import { Stack } from "aws-cdk-lib";
import {Effect, Policy, PolicyStatement} from "aws-cdk-lib/aws-iam";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";

import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from "aws-cdk-lib/aws-apigatewayv2";
import {myDynamoDBFunction} from "./functions/dynamoDB-function/resource";
import {EventSourceMapping, StartingPosition} from "aws-cdk-lib/aws-lambda";
import {subscriptionManager} from "./data/subscription-manager/resource";


const backend = defineBackend({
  auth,
  data,
  storage,
  tgBotSendMessage,
  apiFunction,
  myDynamoDBFunction,
  subscriptionManager
});
const characterTable = backend.data.resources.tables["Character"];

const policy = new Policy(
    Stack.of(characterTable),
    "MyDynamoDBFunctionStreamingPolicy",
    {
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            "dynamodb:DescribeStream",
            "dynamodb:GetRecords",
            "dynamodb:GetShardIterator",
            "dynamodb:ListStreams",
          ],
          resources: ["*"],
        }),
      ],
    }
);
backend.myDynamoDBFunction.resources.lambda.role?.attachInlinePolicy(policy);

const mapping = new EventSourceMapping(
    Stack.of(characterTable),
    "MyDynamoDBFunctionTodoEventStreamMapping",
    {
      target: backend.myDynamoDBFunction.resources.lambda,
      eventSourceArn: characterTable.tableStreamArn,
      startingPosition: StartingPosition.LATEST,
    }
);

mapping.node.addDependency(policy);

const apiStack = backend.createStack("api-stack");

// create a new HTTP Lambda integration
const httpLambdaIntegrationWebHook = new HttpLambdaIntegration(
    "LambdaIntegration",
    backend.apiFunction.resources.lambda
);

// create a new HTTP API with IAM as default authorizer
const httpApi = new HttpApi(apiStack, "HttpApi", {
  apiName: "myHttpApi",
  corsPreflight: {
    // Modify the CORS settings below to match your specific requirements
    allowMethods: [
      CorsHttpMethod.POST,
    ],
    // Restrict this to domains you trust
    allowOrigins: ["*"],
    // Specify only the headers you need to allow
    allowHeaders: ["*"],
  },
  createDefaultStage: true,
});

httpApi.addRoutes({
  path: "/tg-webhook",
  methods: [HttpMethod.POST],
  integration: httpLambdaIntegrationWebHook,
  authorizer: undefined,
});

const apiPolicy = new Policy(apiStack, "ApiPolicy", {
  statements: [
    new PolicyStatement({
      actions: ["execute-api:Invoke"],
      resources: [
        `${httpApi.arnForExecuteApi("*", "/tg-webhook")}`,
      ],
    }),
  ],
});

// attach the policy to the authenticated and unauthenticated IAM roles
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(apiPolicy);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(apiPolicy);

// add outputs to the configuration file
backend.addOutput({
  custom: {
    API: {
      [httpApi.httpApiName!]: {
        endpoint: httpApi.url,
        region: Stack.of(httpApi).region,
        apiName: httpApi.httpApiName,
      },
    },
  },
});

// extract L1 CfnUserPool resources
const { cfnUserPool } = backend.auth.resources.cfnResources;
// modify cfnUserPool policies directly
cfnUserPool.policies = {
  passwordPolicy: {
    minimumLength: 6,
    requireLowercase: false,
    requireNumbers: false,
    requireSymbols: false,
    requireUppercase: false,
    temporaryPasswordValidityDays: 120,
  },
};
const { groups } = backend.auth.resources

// https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_iam.IRole.html
groups["GODS"].role