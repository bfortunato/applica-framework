#!/bin/bash

aj build --platforms web
aj watch --platforms web &

cd platforms/web
bower install
npm install
gulp run --debug &

wait
