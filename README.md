# Offline-First Web App POC

This is a proof of concept for an offline-first web app using AWS Amplify and AWS CDK. The app is a simple recipe managing graphql api that allows for creating and getting recipes

Some technologies used in this project are:
- AWS CDK for infrastructure as code
- AWS AppSync for the graphql api
- AWS DynamoDB for the database storage of the recipes
- AWS Amplify for the frontend and offline capabilities (not part of this repo)

This repository is part of the blog post [Offline-First Recipe Manager with AWS AppSync and Amplify](https://blog.lucasdev.info/offline-first-recipe-manager-with-aws-appsync-and-amplify)

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
