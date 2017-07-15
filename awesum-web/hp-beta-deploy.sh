#!/bin/bash

#bash -c 'cd ../awesum-generator && gulp'
#node_modules/.bin/ng build --prod

if ! test -d dist || ! test -d dist/assets/generator-out ; then
  echo "Unable to find dist directory or genernator-out directory."
  echo "make sure to run awesum-generator and ng build."
  exit 1
fi

rsync -avz -P --delete dist/ proxy.tapo.at:www/beta.awesum.one

