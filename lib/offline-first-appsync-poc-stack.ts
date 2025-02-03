import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as appsync from 'aws-cdk-lib/aws-appsync'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'

export class OfflineFirstAppsyncPocStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // Create an AppSync GraphQL API
    const api = new appsync.GraphqlApi(this, 'RecipeApi', {
      name: 'RecipeApi',
      schema: appsync.SchemaFile.fromAsset('schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
      xrayEnabled: true,
    })

    // Create a DynamoDB table for storing the Recipes
    const recipeTable = new dynamodb.Table(this, 'RecipeTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    })

    // Create resolvers and datasources for appsync api - dynamodb and individual gql resolver functions
    const dataSource = api.addDynamoDbDataSource('RecipeDataSource', recipeTable)

    dataSource.createResolver('get-recipe-ds', {
      typeName: "Query",
      fieldName: "getRecipe",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbGetItem("id", "id"),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    })
    dataSource.createResolver('add-recipe-ds', {
      typeName: "Mutation",
      fieldName: "addRecipe",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
        appsync.PrimaryKey.partition("id").auto(), // Auto-generate the id
        appsync.Values.projecting("input")
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    })

    // output the api url and api key for fe use with amplify
    new cdk.CfnOutput(this, 'GraphQLAPIURL', {
      value: api.graphqlUrl,
    })

    new cdk.CfnOutput(this, 'GraphQLAPIKey', {
      value: api.apiKey || '',
    })
  }
}
