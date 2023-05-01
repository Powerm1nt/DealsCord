#!/bin/sh

source .env

pm2-runtime src/index.js
