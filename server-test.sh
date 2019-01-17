#!/bin/bash

mkdir -p $PWD/data

mongod --dbpath $PWD/data/ &

nodemon server.js