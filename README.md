# todo-app-nodejs
This is a simple Serverless application to show the project structure based on the blog post [Project Structure for Serverless Microservices](https://scratchpad.blog/2019/02/10/project-structure-for-serverless-microservices.html).

# Build & Deploy
The script [deploy.sh](deploy.sh) can be used to deploy the application to any AWS account.

As a prerequisite it is necessary to [install](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) and [configure](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) the AWS CLI. Additionally, it needs a S3 bucket in the same AWS region in which the application will be deployed. The name of the S3 bucket needs to be configured in the Variable `S3_BUCKET` in this script.

The application can be packaged and deployed by running

```bash
source deploy.sh
```

If deployment is finished successfully the script prints out the URL for the API Gateway endpoint end exports it to the environment variable `API_GATEWAY_URL`.

# Test
After deploying the application the REST API endpoints can be tested via `curl`.

The following command lists all the tasks

```bash
curl -i $API_GATEWAY_URL
```

Create task

```bash
curl -i \
     -H "Content-Type: application/json" \
     -d '{ "title": "Task 1", "description": "Lorem ipsum dolor est" }' $API_GATEWAY_URL
```

Delete task with ID `25aa0b59-b845-4c43-9e6e-9673488c6a50`

```bash
curl -i -X "DELETE" $API_GATEWAY_URL/25aa0b59-b845-4c43-9e6e-9673488c6a50
```
