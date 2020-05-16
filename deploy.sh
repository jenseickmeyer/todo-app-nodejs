#!/usr/bin/env bash

S3_BUCKET=
INPUT_FILE=sam-template.yaml
OUTPUT_FILE=sam-template-output.yaml
STAGE_NAME=dev
STACK_NAME=todo-app-$STAGE_NAME

# Copy Swagger file to S3 to be able to transform its content for "deploying" it to API Gateway
aws s3 cp swagger.yaml s3://$S3_BUCKET/swagger.yaml

cd src
npm ci
npm run-script lint
npm prune --production
cd ..

aws cloudformation package --template-file $INPUT_FILE \
                           --output-template-file $OUTPUT_FILE \
                           --s3-bucket $S3_BUCKET
aws cloudformation deploy --template-file $OUTPUT_FILE \
                          --stack-name $STACK_NAME \
                          --parameter-overrides StageName=$STAGE_NAME S3BucketName=$S3_BUCKET \
                          --capabilities CAPABILITY_IAM

export API_GATEWAY_URL=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --query 'Stacks[0].Outputs[0].OutputValue' --output text)

echo "API Gateway URL: $API_GATEWAY_URL"
