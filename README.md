# lambda-vpn-cloudformation

## Overview

This repository is contains the CloudFormation template to create:

1. a VPC
1. a single private subnet
1. an RDS instance running Aurora within the private subnet
1. a role for a lambda function
1. a lambda function that can connect to the Aurora DB

The purpose of this is to illustrate how complex batch jobs with access to dark corners of your team's networking can be replaced by lambda functions for the purposes for cost savings.

## Using this code

This code designed to construct an example of a lambda function connecting to resources in a VPC.  To reuse the code with your existing VPC, just take the part of the template that defines the lambda execution role, the target assumed role and the lambda function itself.
