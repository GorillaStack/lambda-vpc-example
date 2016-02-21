#!/bin/bash

pushd lib
zip -r lambda.zip *
popd
mv lib/lambda.zip .
zip -g lambda.zip -r node_modules/
