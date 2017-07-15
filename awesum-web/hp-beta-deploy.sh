#!/bin/bash

#node_modules/.bin/ng build --prod
rsync -avz -P --delete dist/ proxy.tapo.at:www/beta.awesum.one

