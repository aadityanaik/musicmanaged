#!/bin/bash

mongod --dbpath $PWD/data/ &

node server.js