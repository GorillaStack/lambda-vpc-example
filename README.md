# lambda-vpc-example

## Overview

This repository is contains the CloudFormation template to create:

1. a VPC
1. two private subnets
1. a HA RDS cluster running Aurora within the private subnets
1. a role for a lambda function
1. a lambda function that can connect to the Aurora DB
1. a periodic CloudWatch event rule

The purpose of this is to illustrate how complex batch jobs with access to dark corners of your team's networking can be replaced by lambda functions for the purposes for cost savings.

## Using this code

This code designed to construct an example of a lambda function connecting to resources in a VPC.  To reuse the code with your existing VPC, just take the part of the template that defines the lambda execution role, the target assumed role and the lambda function itself.

## Setup

### 1. Build and upload code to s3

#### Install all dependencies

Run `npm install` to install all dependencies for this repository.

#### Start babel (the es6 to es5 transpiler)

In liew of support for ecmascript2015 in the lambda execution environment, we transpile our es6/ecmascript2015 code to es5.  We have made a grunt task to kick off this transpiler in watch mode, so during development, as you save your files, they are transpiled automatically.

```
# if you have grunt installed globally already:
$ grunt run:babel

# otherwise, use the local grunt module:
$ node_modules/grunt-cli/bin/grunt run:babel
```

#### Build zipfile for s3 upload

NB: your code must have been transpiled already in order to successfully run in s3.

Use the `zip_lambda_code.sh` script provided in the repository to zip all relevant code and modules for lambda.

```
$ bash zip_lambda_code.sh
```

#### Choose or create bucket to house your code

When creating a lambda function from s3 code, we need the s3 bucket to be in the same region as we are running our CloudFormation stack.  Using the AWS CLI, take a look at what buckets you have available to store the lambda code:

```
$ aws s3 ls

2016-02-19 11:21:06 cf-templates-11111-ap-northeast-1
2015-10-08 11:59:04 cf-templates-11111-us-west-1
2015-08-16 12:51:34 random-logs
2015-10-13 22:38:14 some-bucket
...
```

If there is no bucket appropriate to store your code, create a new one.

```
$ aws s3 mb s3://my-lambdas --region <region_name>

make_bucket: s3://my-lambdas/
```

#### Upload the code to s3

```
$ aws s3 cp lambda.zip s3://my-lambdas

upload: ./lambda.zip to s3://my-lambdas/lambda.zip
```

### 2. Create the periodic event source

Unfortunately, CloudFormation does not yet support the creation of events and rules.  For now, we have to create this via the AWS CLI.

```
$ aws events put-rule --name fire-every-5-minutes --region <region_name> --schedule-expression "rate(5 minutes)"

{
    "RuleArn": "arn:aws:events:<region_name>:<account_id>:rule/fire-every-5-minutes"
}
```


### 3. Build your stack

#### Amend the CloudFormation template provided

The example CloudFormation template in the file '`template.json`' builds a VPC with two private subnets, containing a two node HA-Aurora cluster and our lambda function, with the CloudWatch alarm periodic trigger.

Feel free to use the template as it comes, but you will probably just want to lift out the appropriate sections and use in your own existing CloudFormation templates.

#### Substitute variables into the CloudFormation template

Most important one to substitute is the RuleArn from the step above.

#### Manually add VPC configuration for our lambda function

This new VPC configuration option for lambda functions is not yet exposed via CloudFormation.  Real pain!  While we wait for its implementation in CloudFormation, add this configuration via the AWS CLI as follows:

```
$ aws lambda update-function-configuration --function-name <function_name> --vpc-config SubnetIds=string,string,SecurityGroupIds=string,string

```
aws lambda update-function-configuration --function-name TestAurora-LambdaFunction-SKYSWW6KRRI2 --vpc-config SubnetIds=subnet-96227de1,subnet-6503743c,SecurityGroupIds=sg-db679bbf
