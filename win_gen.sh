#!/bin/bash

set -e

# This is a fix script for Windows on generating code-gen files

node ./pre_win.js
cp ./mod-openapi.yaml node_modules/\@apidevtools/json-schema-ref-parser/dist/openapi.yaml
npm run gen
rm ./mod-openapi.yaml
