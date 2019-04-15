#!/bin/bash

aj build --platforms web
aj watch --platforms web &

cd platforms/web
npm install
gulp run
