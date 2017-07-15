#!/bin/bash

bash -c 'cd awesum-generator && npm install && gulp'
bash -c 'cd awesum-web && npm install && ./node_modules/.bin/ng build --prod'

