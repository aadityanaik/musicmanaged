#!/bin/bash

mongod --dbpath $PWD/data/ &

nodemon server.js