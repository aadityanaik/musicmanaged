#!/bin/bash

mkdir -p $PWD/data

mongod --dbpath $PWD/data/ &

node server.js