#!/bin/bash

# This is a fix script for Windows on generating code-gen files

cp ./openapi.yaml node_modules/\@apidevtools/json-schema-ref-parser/dist/
npm run gen
